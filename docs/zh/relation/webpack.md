# Webpack
Webpack是一个 打包模块化JavaScript的工具，它会从入口模块出发，识别出源码中的模块化导入语句，递归地找出入口文件的所有依赖，将入口和其所有的依赖打包到一个单独的文件中。

## 安装

- [node](https://nodejs.org/en/)
- [webpack](https://webpack.js.org/guides/getting-started/)

> 全局安装webpack，将会使项目中的webpack锁定到指定版本，造成不同的项目中因为webpack依赖不同版本而导致冲突，构建失败，所以不建议全局安装

### 检查安装

```js
webpack -v //command not found 默认在全局环境中查找

npx webpack -v// npx帮助我们在项⽬目中的node_modules⾥里里查找webpack
./node_modules/.bin/webpack -v//到当前的node_modules模块⾥里里指定webpack
```

[npx](https://www.npmjs.com/package/npx#description)

## 默认配置

- webpack默认支持JS模块和JSON模块
- 支持CommonJS ES module AMD等模块类型
- webpack4支持零配置使用，但是很弱，稍微复杂的场景都需要额外扩展

```js
const path = require('path')
module.exports = {
    // webpack执行构建入口
    entry: './src/index.js',
    output: {
        // 将所有依赖的模块合并输出到main.js
        filename: 'main.js',
        // 输出文件的存放路径，必须是绝对路径
        path: path.resolve(__dirname, './dist')
    }
}
```

## loader

模块解析，模块转换器，用于把模块原内容按照需求转换成新内容。

webpack是模块打包工具，而模块不仅仅是js，还可以是css，图片或者其他格式。

webpack默认只知道如何处理js和JSON模块，那么其他格式的模块处理就需要loader了。

## module

模块，在webpack里一切皆模块，一个模块对应着一个文件。webpack会从配置的entry开始递归找出所有依赖的模块。

当webpack处理到不认识的模块时，需要在webpack中的module进行配置，当检测到是什么格式的模块，使用什么loader来处理。

```js
module: {
    rules: [
        {
            test: /\.xxx$/, // 指定匹配规则
            use: {
                loader: 'xxx-laod' // 指定使用的loader
            }
        }
    ]
}
```

### file-loader

[file-loader](https://webpack.js.org/loaders/file-loader/)：处理静态资源模块，原理是把打包入口中识别出的资源模块，移动到输出目录，并且返回一个地址名称。

场景：当我们需要模块，仅仅是从源代码挪移到打包目录，就可以使用file-loaer来处理，txt，svg，csv，excel，图片资源等。

```js
npm install file-loader -D
```

### url-loder

[url-loader](https://webpack.js.org/loaders/url-loader/)可以把图片转换成base64。

```js
npm install url-loader -D
```

```js
{
    test: /\.(png|svg|jpg|jpeg|gif)$/,
    loader: 'url-loader',
    options: {
        limit: 1000
    }
}
```

url-loader依赖file-loader，当使用url-loader加载图片，图片大小小于上限值，则将图片转成base64字符串，否则使用file-loader加载图片。

### 样式处理

loader执行顺序：从后往前

[css-loader](https://webpack.js.org/loaders/css-loader/)：分析css模块之间的关系，合并成一个css

[style-loader](https://webpack.js.org/loaders/style-loader/)：会把css-loader生成的内容，以style挂载到页面的head部分

```js
npm install style-loader css-loader -D
```

```js
{
    test: '/\.css$/',
    use: ['style-loader', 'css-loader']
}
```

## plugins

plugin可以在webpack运行到某个阶段的时候，帮你做一些事情，类似于生命周期的概念。

扩展插件，在webpack构建流程中特定时机注入扩展逻辑来改变构建结果或你想要的事情，作用于整个构建过程。

### html-webpack-plugin

[html-webpack-plugin](https://webpack.js.org/plugins/html-webpack-plugin/)会在打包结束后，自动生成一个html文件，并把打包生成的js模块引入到该html中。

```js
npm install html-webpack-plugin -D
```

### clean-webpack-plugin

[clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin)会移除构建的文件夹

```js
npm install clean-webpack-plugin -D
```

