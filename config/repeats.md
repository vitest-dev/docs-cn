---
title: repeats | 配置
outline: deep
---

# repeats

- **类型:** `number`
- **默认值:** `0`
- **命令行终端:** `--repeats=<number>`

无论结果如何，每个测试都会重复运行指定的次数。使用 [`repeats`](/api/test#repeats) 测试选项的测试将优先于此值。

适用于验证测试在多次运行中的稳定性。如果测试在任何一次重复中失败，整个测试将被报告为失败。
