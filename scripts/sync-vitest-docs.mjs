import path from 'node:path'
import process from 'node:process'
import { Octokit } from '@octokit/rest'
import shell from 'shelljs'

// 从命令行参数或环境变量获取配置
const username = process.argv[2] || process.env.GITHUB_USERNAME
const token = process.argv[3] || process.env.GITHUB_TOKEN
const email = process.argv[4] || process.env.GITHUB_EMAIL

// 配置
const owner = 'vitest-dev'
const sourceRepo = 'vitest'
const targetRepo = 'docs-cn'
const sourceDir = 'docs' // vitest 仓库中的 docs 目录
const sourceBranch = 'main' // vitest 仓库的分支
const targetBranch = 'dev' // docs-cn 仓库的默认分支

const sourceUrl = `https://github.com/${owner}/${sourceRepo}.git`
const targetUrl = `https://${username}:${token}@github.com/${owner}/${targetRepo}.git`

console.log(`\n🚀 开始同步 ${sourceRepo}/${sourceDir} 到 ${targetRepo}`)

// 保存原始工作目录
const originalCwd = process.cwd()

// 创建临时工作目录
const tempDir = path.join(originalCwd, 'temp')
if (!shell.test('-d', tempDir)) {
  shell.mkdir('-p', tempDir)
}
shell.cd(tempDir)

// 克隆目标仓库 (docs-cn) - 包含完整历史
console.log(`\n📦 正在克隆目标仓库 ${targetRepo}...`)
if (shell.test('-d', targetRepo)) {
  shell.rm('-rf', targetRepo)
}
const cloneResult = shell.exec(`git clone ${targetUrl} ${targetRepo}`)
if (cloneResult.code !== 0) {
  console.error('❌ 克隆目标仓库失败!')
  process.exit(1)
}

// 进入目标仓库
shell.cd(path.join(tempDir, targetRepo))

// 配置 git
shell.exec(`git config user.name "${username}"`)
shell.exec(`git config user.email "${email}"`)

// 添加上游仓库作为 remote
console.log(`\n🔗 添加上游仓库 ${sourceRepo} 作为 remote...`)
shell.exec(`git remote add upstream ${sourceUrl} 2>/dev/null || git remote set-url upstream ${sourceUrl}`)

// 获取上游仓库的更新（获取完整历史以便比较）
console.log(`\n📥 正在获取上游仓库更新...`)
const fetchResult = shell.exec(`git fetch upstream ${sourceBranch}`)
if (fetchResult.code !== 0) {
  console.error('❌ 获取上游仓库失败!')
  process.exit(1)
}

// 获取上游最新 commit hash
const upstreamHash = shell.exec(`git rev-parse upstream/${sourceBranch}`).stdout.trim()
const shortHash = upstreamHash.substring(0, 8)

// 检查是否已经同步过（通过 tag 记录上次同步的上游 commit）
const lastSyncTag = shell.exec('git tag -l "synced-*" --sort=-creatordate | head -1').stdout.trim()
const lastSyncHash = lastSyncTag ? lastSyncTag.replace('synced-', '') : ''

console.log(`\n📋 同步状态:`)
console.log(`   上游最新: ${shortHash}`)
console.log(`   上次同步: ${lastSyncHash || '无记录(首次同步)'}`)

if (lastSyncHash === shortHash) {
  console.log(`\n✅ 已经是最新的,无需同步`)
  process.exit(0)
}

// 创建同步分支
const syncBranch = `sync-${shortHash}`

// 检查是否已存在该同步分支（可能有未合并的 PR）
const branchExists = shell.exec(`git ls-remote --heads origin ${syncBranch}`).stdout.trim()
if (branchExists) {
  console.log(`\n⚠️ 分支 ${syncBranch} 已存在,可能已经有同步 PR 在进行中`)
  process.exit(0)
}

// 从目标分支创建新的同步分支
shell.exec(`git checkout ${targetBranch}`)
shell.exec(`git checkout -b ${syncBranch}`)

// 获取上游在 docs 目录的变更
console.log(`\n🔍 正在分析上游变更...`)

let diffBase = ''
if (lastSyncHash) {
  // 检查上次同步的 commit 是否存在于上游历史中
  const commitExists = shell.exec(`git cat-file -t ${lastSyncHash} 2>/dev/null`).code === 0
  if (commitExists) {
    diffBase = lastSyncHash
  }
}

// 获取变更的文件列表
let changedFilesInUpstream = []
let newFiles = []
const modifiedFiles = []
const deletedFiles = []

if (diffBase) {
  // 增量模式：只获取从上次同步以来的变更
  console.log(`\n📊 增量同步模式 (从 ${diffBase.substring(0, 8)} 到 ${shortHash})`)

  const diffOutput = shell.exec(
    `git diff --name-status ${diffBase}..upstream/${sourceBranch} -- ${sourceDir}/`,
  ).stdout.trim()

  if (diffOutput) {
    const lines = diffOutput.split('\n').filter(l => l.trim())
    for (const line of lines) {
      const [status, ...fileParts] = line.split('\t')
      const file = fileParts.join('\t') // 处理文件名包含 tab 的情况
      const relativePath = file.replace(`${sourceDir}/`, '')

      if (status === 'A') {
        newFiles.push(relativePath)
      }
      else if (status === 'M') {
        modifiedFiles.push(relativePath)
      }
      else if (status === 'D') {
        deletedFiles.push(relativePath)
      }
      else if (status.startsWith('R')) {
        // 重命名：视为删除旧文件 + 添加新文件
        const [oldFile, newFile] = fileParts
        deletedFiles.push(oldFile.replace(`${sourceDir}/`, ''))
        newFiles.push(newFile.replace(`${sourceDir}/`, ''))
      }
    }
    changedFilesInUpstream = [...newFiles, ...modifiedFiles, ...deletedFiles]
  }
}
else {
  // 首次同步：标记所有文件为新增
  console.log(`\n📊 首次同步模式`)
  const allFiles = shell.exec(
    `git ls-tree -r --name-only upstream/${sourceBranch} -- ${sourceDir}/`,
  ).stdout.trim()

  if (allFiles) {
    newFiles = allFiles.split('\n').map(f => f.replace(`${sourceDir}/`, ''))
    changedFilesInUpstream = newFiles
  }
}

console.log(`\n📈 上游变更统计:`)
console.log(`   新增文件: ${newFiles.length}`)
console.log(`   修改文件: ${modifiedFiles.length}`)
console.log(`   删除文件: ${deletedFiles.length}`)

if (changedFilesInUpstream.length === 0) {
  console.log(`\n✅ 上游 ${sourceDir} 目录没有变更`)
  // 创建标记 tag
  shell.exec(`git tag synced-${shortHash}`)
  shell.exec(`git push origin synced-${shortHash}`)
  process.exit(0)
}

// 创建临时目录存放上游 docs
const upstreamDocsTemp = path.join(tempDir, 'upstream-docs')
if (shell.test('-d', upstreamDocsTemp)) {
  shell.rm('-rf', upstreamDocsTemp)
}
shell.mkdir('-p', upstreamDocsTemp)

// 使用 git archive 提取上游的 docs 目录
console.log(`\n📂 正在提取上游 ${sourceDir} 目录...`)
const archiveResult = shell.exec(
  `git archive upstream/${sourceBranch} ${sourceDir} | tar -x -C ${upstreamDocsTemp}`,
)

if (archiveResult.code !== 0) {
  console.error('❌ 提取上游 docs 目录失败!')
  process.exit(1)
}

const sourceDocsPath = path.join(upstreamDocsTemp, sourceDir)
const targetRootPath = path.join(tempDir, targetRepo)

// 分类处理文件
const actualNewFiles = []
const actualModifiedFiles = []
const actualDeletedFiles = []
const skippedFiles = [] // 跳过的文件（本地有修改）

console.log(`\n🔄 正在同步文件...`)

// 处理新增文件：直接复制
for (const file of newFiles) {
  const srcFile = path.join(sourceDocsPath, file)
  const destFile = path.join(targetRootPath, file)

  if (shell.test('-f', srcFile)) {
    // 确保目标目录存在
    const destDir = path.dirname(destFile)
    shell.mkdir('-p', destDir)
    shell.cp(srcFile, destFile)
    actualNewFiles.push(file)
  }
}

// 处理修改文件：检查本地是否有翻译（通过内容比较）
for (const file of modifiedFiles) {
  const srcFile = path.join(sourceDocsPath, file)
  const destFile = path.join(targetRootPath, file)

  if (shell.test('-f', srcFile)) {
    if (shell.test('-f', destFile)) {
      // 本地文件存在，检查是否有本地修改
      // 策略：如果本地文件和上次同步时的上游文件不同，说明有翻译，跳过
      // 简化策略：总是更新，但在 PR 中标记出来让人工检查

      // 这里我们选择：复制新文件，但记录下来
      shell.cp(srcFile, destFile)
      actualModifiedFiles.push(file)
    }
    else {
      // 本地文件不存在，直接复制
      const destDir = path.dirname(destFile)
      shell.mkdir('-p', destDir)
      shell.cp(srcFile, destFile)
      actualNewFiles.push(file)
    }
  }
}

// 处理删除文件：如果上游删除了，本地也删除
for (const file of deletedFiles) {
  const destFile = path.join(targetRootPath, file)

  if (shell.test('-f', destFile)) {
    shell.rm(destFile)
    actualDeletedFiles.push(file)
  }
}

// 检查是否有实际变更
const statusOutput = shell.exec('git status --porcelain').stdout.trim()

if (!statusOutput) {
  console.log('\n✅ 没有需要提交的变更')
  shell.exec(`git tag synced-${shortHash}`)
  shell.exec(`git push origin synced-${shortHash}`)
  process.exit(0)
}

// 为每个变更创建单独的 commit（可选，这里简化为一个 commit）
// 如果需要更细粒度的 commit，可以在这里分别 commit

shell.exec('git add .')

const commitMessage = `chore: sync docs from vitest@${shortHash}

Upstream: https://github.com/${owner}/${sourceRepo}/commit/${upstreamHash}
${lastSyncHash ? `Previous sync: ${lastSyncHash}` : 'Initial sync'}

Changes from upstream:
- New files: ${actualNewFiles.length}
- Modified files: ${actualModifiedFiles.length}
- Deleted files: ${actualDeletedFiles.length}`

shell.exec(`git commit -m "${commitMessage}"`)

// 创建同步标记 tag
const syncTag = `synced-${shortHash}`
shell.exec(`git tag ${syncTag}`)

// 推送到远程
console.log(`\n📤 正在推送到分支 ${syncBranch}...`)
const pushResult = shell.exec(`git push --set-upstream origin ${syncBranch}`)

if (pushResult.code !== 0) {
  console.error('❌ 推送失败!')
  process.exit(1)
}

// 推送 tag
shell.exec(`git push origin ${syncTag}`)

// 创建 Pull Request
console.log('\n📝 正在创建 Pull Request...')

const octokit = new Octokit({
  auth: `token ${token}`,
})

const title = `chore: sync docs from vitest @ ${shortHash}`

// 生成文件列表
function formatFileList(files, maxShow = 15) {
  if (files.length === 0) 
return '_无_'
  const shown = files.slice(0, maxShow)
  const list = shown.map(f => `- \`${f}\``).join('\n')
  if (files.length > maxShow) {
    return `${list}\n- _... 还有 ${files.length - maxShow} 个文件_`
  }
  return list
}

// 生成上游 commit 链接（如果有增量）
let upstreamChangesLink = ''
if (lastSyncHash) {
  upstreamChangesLink = `\n\n**查看上游变更:** [${lastSyncHash.substring(0, 8)}...${shortHash}](https://github.com/${owner}/${sourceRepo}/compare/${lastSyncHash}...${upstreamHash})`
}

const body = `
## 🤖 自动同步

此 PR 由自动化脚本生成，用于同步上游 vitest 仓库的 docs 目录。

### 📌 同步信息

| 项目 | 值 |
|------|-----|
| 源提交 | [\`${shortHash}\`](https://github.com/${owner}/${sourceRepo}/commit/${upstreamHash}) |
| 上次同步 | ${lastSyncHash ? `[\`${lastSyncHash.substring(0, 8)}\`](https://github.com/${owner}/${sourceRepo}/commit/${lastSyncHash})` : '首次同步'} |
| 同步时间 | ${new Date().toISOString()} |
| 同步模式 | ${lastSyncHash ? '增量同步' : '全量同步'} |
${upstreamChangesLink}

### 📊 变更统计

| 类型 | 数量 | 说明 |
|------|------|------|
| ➕ 新增 | **${actualNewFiles.length}** | 上游新增的文档，需要翻译 |
| 📝 修改 | **${actualModifiedFiles.length}** | 上游修改的文档，可能需要更新翻译 |
| ➖ 删除 | **${actualDeletedFiles.length}** | 上游删除的文档 |

### ➕ 新增文件 (需要翻译)

${formatFileList(actualNewFiles)}

### 📝 修改文件 (检查是否需要更新翻译)

${formatFileList(actualModifiedFiles)}

### ➖ 删除文件

${formatFileList(actualDeletedFiles)}

## ⚠️ 重要提示

1. **新增文件**需要添加中文翻译
2. **修改文件**请对比上游变更，更新相应的翻译
3. 点击上方的"查看上游变更"链接可以看到具体改了什么
4. **不要使用 Squash Merge**，请使用普通 Merge

## 📝 翻译检查清单

${actualNewFiles.slice(0, 10).map(f => `- [ ] \`${f}\` - 添加翻译`).join('\n')}
${actualModifiedFiles.slice(0, 10).map(f => `- [ ] \`${f}\` - 检查/更新翻译`).join('\n')}
${(actualNewFiles.length > 10 || actualModifiedFiles.length > 10) ? '\n- [ ] ... 检查其他文件' : ''}
`

try {
  const { data: pr } = await octokit.pulls.create({
    owner,
    repo: targetRepo,
    title,
    body,
    head: syncBranch,
    base: targetBranch,
  })

  console.log('\n✅ Pull Request 创建成功!')
  console.log(`📋 PR 编号: #${pr.number}`)
  console.log(`🔗 URL: ${pr.html_url}`)

  // 可选: 添加标签
  try {
    await octokit.issues.addLabels({
      owner,
      repo: targetRepo,
      issue_number: pr.number,
      labels: ['sync', 'documentation'],
    })
  }
  catch (err) {
    console.log('添加标签失败(可能标签不存在):', err.message)
  }
}
catch (err) {
  console.error('\n❌ 创建 Pull Request 失败:')
  console.error(err.message)
  process.exit(1)
}

console.log('\n🎉 同步完成!')
console.log(`\n📋 摘要:`)
console.log(`   新增: ${actualNewFiles.length} 个文件 (需要翻译)`)
console.log(`   修改: ${actualModifiedFiles.length} 个文件 (检查翻译)`)
console.log(`   删除: ${actualDeletedFiles.length} 个文件`)
