# 调试

## VSCode

要在 VSCode 中调试测试文件，请创建以下启动配置。



```json
{
    // 想了解更多的信息, 可以访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "pwa-node",
            "request": "launch",
            "name": "Debug Current Test File",
            "autoAttachChildProcesses": true,
            "skipFiles": ["<node_internals>/**", "**/node_modules/**"],
            "program": "${workspaceRoot}/node_modules/vitest/vitest.mjs",
            "args": ["run", "${relativeFile}"],
            "smartStep": true,
            "console": "integratedTerminal"
        }
    ]
}
```

然后在调试选项卡中确保选择 'Debug Current Test File' ，然后您可以打开要调试的测试文件并按 F5 开始调试。

## IntelliJ IDEA

创建一个 'Node.js' 的启动配置. 使用下面的配置在 debug 模式下运行所有测试文件:

配置项 | 配置值
 --- | ---
Working directory | /path/to/your-project-root
JavaScript file | ./node_modules/vitest/vitest.mjs
Application parameters | run --threads false

然后在 debug 模式下运行这个配置，IDE 将在编辑器中设置的 JS/TS 断点处停止