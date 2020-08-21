# Node相关工具

## Nodemon

使用[nodemon](https://www.npmjs.com/package/nodemon)可以监视文件，不用每次修改代码后重新执行node命令

## Jest

[jest](https://jestjs.io/docs/en/getting-started)可以全局安装，也可以局部安装。

```js
// sum.js
function sum(a, b) {
  return a + b
}
module.exports = sum
```

```js
// sum.test.js
const sum = require('./sum.js')
test ('add 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
```

- 全局安装：`npm install -g jest`

  使用：`jest myfile`，

  - 测试时可以添加`watch`参数，监视某个文件是否测试通过，`jest sum.test.js --watch`

- 局部安装：`npm install -D jest`

## 测试代码生成工具

