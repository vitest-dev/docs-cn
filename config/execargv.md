---
title: execArgv | Config
outline: deep
---

# execArgv

- **类型:** `string[]`
- **默认值:** `[]`

向运行器工作线程中 `node` 传递额外参数，请参阅 [Command-line API | Node.js](https://nodejs.org/docs/latest/api/cli.html)。

:::warning
使用时要小心，因为某些选项（如 `--prof`、 `--title`）可能会导致 `worker` 崩溃。更多内容请参阅 https://github.com/nodejs/node/issues/41103。
:::
