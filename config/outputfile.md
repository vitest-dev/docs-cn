---
title: outputFile | 配置
outline: deep
---

# outputFile <CRoot /> {#outputfile}

- **类型:** `string | Record<string, string>`
- **命令行终端:** `--outputFile=<path>`, `--outputFile.json=./path`

当指定 `--reporter=json`、`--reporter=html` 或 `--reporter=junit` 时，将测试结果写入文件。通过提供对象而非字符串，你可以在使用多个报告器时定义各自的输出配置。
