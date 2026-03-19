---
title: outputFile | Config
outline: deep
---

# outputFile <CRoot /> {#outputfile}

- **类型:** `string | Record<string, string>`
- **命令行终端:** `--outputFile=<path>`, `--outputFile.json=./path`

Write test results to a file when the `--reporter=json`, `--reporter=html` or `--reporter=junit` option is also specified.
By providing an object instead of a string you can define individual outputs when using multiple reporters.
