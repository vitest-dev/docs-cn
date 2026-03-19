---
title: chaiConfig | Config
outline: deep
---

# chaiConfig

- **类型:** `{ includeStack?, showDiff?, truncateThreshold? }`
- **默认值:** `{ includeStack: false, showDiff: true, truncateThreshold: 40 }`

Equivalent to [Chai config](https://github.com/chaijs/chai/blob/4.x.x/lib/chai/config.js).

## chaiConfig.includeStack

- **类型:** `boolean`
- **默认值:** `false`

Influences whether stack trace is included in Assertion error message. Default of false suppresses stack trace in the error message.

## chaiConfig.showDiff

- **类型:** `boolean`
- **默认值:** `true`

Influences whether or not the `showDiff` flag should be included in the thrown AssertionErrors. `false` will always be `false`; `true` will be true when the assertion has requested a diff to be shown.

## chaiConfig.truncateThreshold

- **类型:** `number`
- **默认值:** `40`

Sets length threshold for actual and expected values in assertion errors. If this threshold is exceeded, for example for large data structures, the value is replaced with something like `[ Array(3) ]` or `{ Object (prop1, prop2) }`. Set it to `0` if you want to disable truncating altogether.

This config option affects truncating values in `test.each` titles and inside the assertion error message.
