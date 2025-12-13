---
title: execArgv | Config
outline: deep
---

# execArgv

- **类型:** `string[]`
- **默认值:** `[]`

在线程中向 `node` 传递附加参数。更多信息，具体可以浏览 [Command-line API | Node.js](https://nodejs.org/docs/latest/api/cli.html) 。

:::warning 警告
使用时要小心，因为某些选项（如 `--prof`、 `--title`）可能会导致 `worker` 崩溃。具体信息可以浏览 https://github.com/nodejs/node/issues/41103 。
:::
