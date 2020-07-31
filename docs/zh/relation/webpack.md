# Webpack

Webpack是一个 打包模块化JavaScript的工具，它会从入口模块出发，识别出源码中的模块化导入语句，递归地找出入口文件的所有依赖，将入口和其所有的依赖打包到一个单独的文件中。

## 安装

- [node](https://nodejs.org/en/)
- [webpack](https://webpack.js.org/guides/getting-started/)

```js
npm install webpack webpack-cli --save-dev
```



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

## hash/chunkHash/contentHash

- hash：作用于每次构建
- contentHash：作用于内容，自己的内容改变则改变
- [chunkHash](https://webpack.js.org/concepts/under-the-hood/#chunks)：作用于chunk，当chunk里的模块发生改变则改变
  - entry，每个入口就是一个chunk
  - dynamic import和splitChunks

js：适合chunkHash

css：适合contentHash

image：hash即可

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

## loader

模块解析，模块转换器，用于把模块原内容按照需求转换成新内容。

webpack是模块打包工具，而模块不仅仅是js，还可以是css，图片或者其他格式。

webpack默认只知道如何处理js和JSON模块，那么其他格式的模块处理就需要loader了。

### file-loader

[file-loader](https://webpack.js.org/loaders/file-loader/)：处理静态资源模块，原理是把打包入口中识别出的资源模块，移动到输出目录，并且返回一个地址名称。

场景：当我们需要模块，仅仅是从源代码挪移到打包目录，就可以使用file-loaer来处理，txt，svg，csv，excel，图片资源等。

```js
npm install file-loader -D
```

### url-loder

[url-loader](https://webpack.js.org/loaders/url-loader/)可以把图片转换成base64。

url-loader内部使用了file-loader，所以可以处理file-loader所有的事情，但是遇到jpg格式的模块，会把该图片转换成base64格式字符串，并打包到js里。对小体积的图片比较合适，大图片不合适。

```js
npm install url-loader -D
```

```js
{
    test: /\.(png|svg|jpg|jpeg|gif)$/,
    loader: 'url-loader',
    options: {
        limit: 1000 // 小于limit时，转换成base64字符串
    }
}
```

>  url-loader依赖file-loader，当使用url-loader加载图片，图片大小小于上限值，则将图片转成base64字符串，否则使用file-loader加载图片。

### 样式处理

[loader执行顺序](https://webpack.js.org/configuration/module/#ruleuse)：从后往前

[css-loader](https://webpack.js.org/loaders/css-loader/)：分析css模块之间的关系，合并成一个css

[style-loader](https://webpack.js.org/loaders/style-loader/)：会把css-loader生成的内容，以style挂载到页面的head部分

```js
npm install style-loader css-loader -D
```

```js
{
    test: '/\.css$/',
    use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
}
```

> 注意[postcss-loader的位置](https://www.npmjs.com/package/postcss-loader#config-cascade)

安装postcss-loader和autoprefixer，实现自动补全浏览器属性前缀（如：display: flex）：

```js
npm install postcss postcss-loader autoprefixer -D
```

在webpack.config.js的同目录级别新建一个[postcss.config.js](https://github.com/postcss/autoprefixer#options)：

```js
module.exports = {
  plugins: [
    require('autoprefixer')({
      // overrideBrowserslist会覆盖webpack.config.js里的Browserslist
      overrideBrowserslist: ['last 2 versions', '>1%']
    })
  ]
}
```

### 字体处理

[阿里巴巴-普惠体](https://www.iconfont.cn/webfont?spm=a313x.7781069.1998910419.12&puhui=1#!/webfont/index)下载后，把.eot,.svg,.ttf等字体文件拷贝到src/styles/font/目录下，

```js
// src/styles/index.less
@font-face {
  font-family: 'webfont';
  font-display: swap;
  src: url('../font/webfont.eot'); /* IE9 */
  src: url('../font/webfont.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('../font/webfont.woff2') format('woff2'),
  url('../font/webfont.woff') format('woff'), /* chrome、firefox */
  url('../font/webfont.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('../font/webfont.svg#webfont') format('svg'); /* iOS 4.1- */
}

.web-font {
  font-family: "webfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

```js
// index.html
<i class="web-font">执子之手，方知子丑，泪流满面，子不走我走</i>
```

```js
// webpack.config.js
{
    test: /\.(eot|ttf|woff|woff2|svg)$/,
        use: {
            loader: 'url-loader',
            options: {
                name: '[name]_[hash:6].[ext]',
                outputPath: 'iconfont/',
                limit: 1024
            }
        }
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

```js
var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        })
    ]
}
```

#### 多页面打包处理（一般方案）

```js
// webpack.config.js
  entry: {
    main: './src/index.js',
    list: './src/list.js',
    detail: './src/detail.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'list.html',
      chunks: ['list']
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'detail.html',
      chunks: ['detail', 'list'] // 在html里引入时的顺序和此处的顺序无关，和entry里的顺序有关
    })
  ]

```

#### 多页面打包（通用方案）

使用[glob](https://www.npmjs.com/package/glob)

### clean-webpack-plugin

[clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin)会移除构建的文件夹

```js
npm install clean-webpack-plugin -D
```

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

webpackConfig = {
    plugins: [ new CleanWebpackPlugin() ]
}
```

### mini-css-extract-plugin

[mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin)， 不使用style内联方式引入，而是把css单独提取到.css文件

```js
npm install --save-dev mini-css-extract-plugin
```

```js
module: {
    rules: [
      {
        test: /\.less$/,
        // use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
      }
    ]
},
plugins: [
    new MiniCssExtractPlugin({
        filename: '[name][chunkhash:8].css'
    })
]
```

> 一个入口肯定是一个chunk，但一个chunk不一定只有一个依赖

### sourceMap

源代码与打包后的代码的映射关系，通过sourceMap定位到源代码。

在dev模式中，默认开启，关闭的，可以在配置文件里：

```js
devtool: 'none'
```

eval：速度最快，使用eval包裹模块代码

source-map：产生.map文件

cheap：较快，不包含列信息

module：第三方模块，包含loader的source（如bable的source）

inline：将.map作为DataURI嵌入，不单独生成.map文件

配置推荐：

```js
devtool: 'cheap-module-eval-source-map' // 开发环境

// 线上不推荐开启，如果确实需要的话，使用下面的配置
devtool: 'cheap-module-source-map'
```

### webpack-dev-server

安装，[webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server)

```js
npm install webpack-dev-server --save-dev
```

每次改完代码都需要重新打包一次，打开浏览器，刷新一次，可以使用webpack-dev-server来改善

[配置参数](https://webpack.js.org/configuration/dev-server/)

```js
devServer: {
    port: 9090,
    contentBase: path.join(__dirname, 'public')
}
```

contentBase: './public' // 需要静态文件的时候才可能需要该配置

如在public/ht.jpg，启动devServer后，浏览器里就可以看到静态文件：http://localhost:9090/ht.jpg

```js
// package.json
"scripts": {
    "dev:server": "webpack-dev-server"
}
```

启动服务后，会发现dist目录没有了，这是因为devServer把打包后的模块不会放在dist目录下，而是放到内存中，从而提升速度

proxy配置：

```js
devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9091'
      }
    }
}
```

```js
// index.js
axios.get('/api/info')
  .then(res => {
    console.log(res)
  })
```

```js
// server.js
const express = require('express')

const app = express()

app.get('/api/info', (req, res) => {
  res.json({
    name: 'andy',
    age: 20,
    sex: '男'
  })
})

app.listen('9091')
console.log('server is running at http://localhost:9091')
// 启动：node server.js
```

### Hot Module Replacement(HMR: 热模块替换)

默认的**内联css**可以使用HMR

```js
devServer: {
    hot: true,
    // 即便HMR不生效，浏览器也不自动刷新，就开启hotOnly
    hotOnly: true
}
```

> 启动HMR后，抽离的css不会生效，不支持contentHash，chunkHash

hot和hotOnly的区别：在某些模块不支持热更新的情况下，前者会自动刷新页面，后者不会，而是在控制台输出热更新失败。

#### 处理js模块的HMR

需要webpack.HotModuleReplacementPlugin()插件：

```js
const webpack = require('webpack')

plugins: [
    new webpack.HotModuleReplacementPlugin()
]
```

需要使用module.hot.accept来观察模块更新：先删除已经存在的，再重新生成

```js
// counter.js
function counter() {
  var div = document.createElement('div')
  div.setAttribute('id', 'counter')
  div.innerHTML = 1
  div.onclick = function() {
    div.innerHTML = parseInt(div.innerHTML, 10) + 1
  }
  document.body.appendChild(div)
}

export default counter
```

```js
// number.js
function number() {
  var div = document.createElement('div')
  div.setAttribute('id', 'number')
  div.innerHTML = 13
  document.body.appendChild(div)
}

export default number
```

```js
// index.js
import counter from './counter'
import number from './number'

counter()
number()

if (module.hot) {
  module.hot.accept('./number', function() {
    document.body.removeChild(document.getElementById('number'))
    number()
  })
}
```

以上是原生的js热模块替换，一般使用[框架进行开发](https://webpack.js.org/guides/hot-module-replacement/#other-code-and-frameworks)，使用已有的loader即可，不用这么手动设置

### babel

[babel-loader](https://webpack.js.org/loaders/babel-loader/)

[babel官网](https://babeljs.io/)

babel在执行编译的过程中，会从项目根目录下的[.babel](https://babeljs.io/docs/en/config-files#supported-file-extensions)文件中读取配置。若没有该文件，则会从loader的options地方读取配置。

```js
npm install -D babel-loader @babel/core @babel/preset-env
```

babel-loader：是webpack与babel的通信桥梁，不会做es6转成es5的工作，这部分工作需要用到@babel/preset-env来做

@bebel/preset-env：包含了es6,7,8转es5的转换规则

```js
{
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
    loader: 'babel-loader',
		options: {
			presets: ['@babel/preset-env']
		}
	}
}
```

#### polyfill

bebel的转译只是语法层次的，例如箭头函数、解构赋值、class，所以对一些新增的API以及全局函数(如：Promise，Array.includes)是无法转译的，所以需要polyfill。

```js
// 是--save
npm install --save @babel/polyfill
```

##### 按需加载，减少冗余

polyfill默认会把所有特性注入进来，使用[useBuiltIns](https://babeljs.io/docs/en/babel-preset-env#usebuiltins)按需注入，它有3个值：

- entry：需要在webpack的入口文件里`import '@bable/polyfill'`一次，babel会根据使用情况导入垫片，没有使用的功能不会被导入相应的垫片。

- usage：不需要`import`，全自动检测，但是需要安装`@babel/polyfill`

  > usage的行为类似babel-transform-runtime，不会造成全局污染，因此也不会对类似Array.prototype.includes()进行polyfill

- false：如果`import '@babel/polyfill'`，它不会排除掉没有使用的垫片(**不推荐**)

> - babel-v7.4.0开始不推荐使用@babel/polyfill，而是推荐使用设置版本的`core-js`（如core-js@3）

```js
{
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
    	loader: 'babel-loader',
    	options: {
    		presets: [
    			[
    				'@babel/preset-env',
    				{
                        targets: {
                            edge: "17",
                            firefox: "60",
                            chrome: "67",
                            safari: "11.1"
                        },
    					useBuiltIns: 'usage',
   						corejs: 3
                    }
                ]
    		]
    	}
	}
}
```

为了减少webpack.config.js文件的大小，可以抽离babel的配置到一个单独的文件.babelrc，把options部分拷贝到该文件即可：

```js
// webpack.config.js
{
    test: /\.js$/,
    use: {
        loader: 'babel-loader'
    }
}
```

```json
// .babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ]
}
```

[.babelrc支持的后缀](https://babeljs.io/docs/en/config-files#file-relative-configuration)

#### 配置React打包环境

安装：`npm install react react-dom --save`

编写react代码：

```js
// index.js
// 支持react语法
import React, { Component } from "react";
import ReactDom from "react-dom";
class App extends Component {
  render() {
    return <div>hello world</div>;
  }
}
ReactDom.render(<App />, document.getElementById("app"));
```

安装[babel与react转换的插件](https://babeljs.io/docs/en/babel-preset-react)：`npm install --save-dev @babel/preset-react`

在babelrc里配置：

```json
// .babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ],
    "@babel/preset-react"
  ]
}
```

### @babel/plugin-transform-runtime

当开发组件库、工具库的时候，[polyfill就不合适](https://babeljs.io/docs/en/babel-polyfill#details)了，因为polyfill是注入到全局变量，会污染全局环境，所以推荐闭包方式：[@babel/plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime)

配置.babelrc，注释掉presets里，添加plugins：

```json
{
  //  "presets": [ ... ],
  "plugins": ["@babel/plugin-transform-runtime"]
}
```

## webpack性能优化

### 优化开发体验

- 提升开发效率
- 优化构建速度
- 优化使用体验

###　优化输出质量

- 优化要发布到线上的代码，减少用户能感知到的加载时间
- 提升代码性能，性能好，执行就快

### 缩小搜索Loader的文件范围

优化loader配置：

- test、include、exclude三个配置项来缩小loader的处理范围

- 推荐使用[include](https://webpack.js.org/configuration/module/#condition)，更精准

  ```js
  module: {
      rules: [
          test: /\.css$/,
          includes: path.resolve(__dirname, './src'),
          use: ['style-loader', 'css-loader']
      ]
  }
  ```

### 优化resolve.modules配置

[resolve.modules](https://webpack.js.org/configuration/resolve/#resolvemodules)用于配置webpack去哪些目录下寻找第三方模块，默认是['node_modules']。

默认在当前项目目录下的node_modules里面去找，如果没有找到，就会去上一级目录../node_modules找，再没有会去../../node_modules去找，以此类推，和Node.js的模块寻找机制类似。

如果使用的第三方模块都安装在了项目根目录下，就可以直接指明这个路径：

```js
module.exports = {
    resolve: {
        modules: ['node_modules'],
        // modules: [path.resolve(__dirname, 'src'), 'node_modules'] // 先从src里搜索
    }
}
```

范例：优化react的解析，

react库，一般存在两套代码：

- cjs：采用commonJS规范的模块化代码

- umd：已经打包好的完整代码，没有采用模块化，可以直接执行

默认情况下，webpack会从入口文件`./node_modules/react/index.js`开始解析和处理依赖的文件。我们可以直接指定文件，避免此处的耗时。

```js
alias: {
    react: path.resolve(__dirname, './node_modules/react/cjs/react.production.min.js'),
    react-dom: path.resolve(__dirname, './node_modules/react-dom/cjs/react-dom.production.min.js')
}
```



### 优化resolve.alias配置

[resolve.alias](https://webpack.js.org/configuration/resolve/#resolvealias)配置通过别名来将原导入路径映射成一个新的导入路径

```js
module.export = {
    resolve: {
        '@assets': './src/images'
    }
}
```

**在css里使用，需要添加波浪号前缀**：

```js
li {
    background: url(~@assets/logo.png);
}
```

### 优化resolve.extensions配置

resolve.extensions在导入语句没带文件后缀时，webpack会自动带上后缀后，去尝试查找文件是否存在。

默认值：

```js
extensions: ['.js', '.json', '.jsx', '.ts']
```

- 后缀尝试列表尽量的小
- 导入语句尽量带上后缀

### 使用externals优化cdn静态资源

公司有cdn，把静态资源都部署到cdn上，使用cdn

比如可以将一些js文件存储在cdn上(减少webpack打包出来的js体积)，在index.html中通过标签引入：

### 使用静态资源路径publicPath(cdn)

```js
module.exports = {
    output: {
        // 一般作用于production模式，指定存放js文件的cdn地址
        publicPath: 'https://cdn.test.com'
    }
}
```

打包后，在dist/index.html里引入的script标签就会添加自动前缀。

- 确保cdn服务器地址正确
- 确保静态资源已经上传

### 借助MiniCssExtractPlugin抽离css

如果不做抽取配置，css是直接打包进js里面的。因为单独生成css，可以和js并行下载，提高页面加载效率。

```js
npm install mini-css-extract-plugin -D
```

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// module
{
    test: /\.less$/,
    // use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
    include: path.resolve(__dirname, './src'), // 推荐使用
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
}

// plugins
new MiniCssExtractPlugin({
    // 抽离后，容易造成层级不对应，比如引入了images文件夹下一个图片
	filename: 'css/[name][chunkhash:8].css'
})
```

>  使用该插件后，不再需要`style-loader`，而是使用`MiniCssExtractPlugin.loader`

抽离css到css文件夹后，可能会造成层级不对应问题，需要设置publicPath：

```js
use: [
    // MiniCssExtractPlugin.loader,
    {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: '../'
        }
    },
    'css-loader',
    'postcss-loader',
    'less-loader'
]
```



### 压缩css

- 借助optimize-css-assets-webpack-plugin，用到了cssnano

安装：

```js
npm install optimize-css-assets-webpack-plugin cssnano -D
```

```js
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

new OptimizeCssAssetsPlugin({
    cssProcessor: require('cssnano'),
    cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
    }
})
```

### 压缩HTML

使用[html-webpack-plugin的minify](https://www.npmjs.com/package/html-webpack-plugin#minification)

```js
new HtmlWebpackPlugin({
    minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
    }
})
```

### 图片压缩

使用[image-webpack-loader](https://www.npmjs.com/package/image-webpack-loader)

安装：`npm install image-webpack-loader --save-dev`

> `file-loader`和`url-loader`都可以使用，但要注意使用`url-loader`时可能图片是base64的形式，所以需要设置`limit`

```js
use: [
		{
            loader: 'url-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
              outputPath: 'images/',
              limit: 1000
            }
        },
        {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
        }
	]
```

## development/production模式区分打包

利用`webpack-merge`，进行base、dev、pro文件的合并。

```js
// webpack.dev.config.js
const merge = require('webpack-merge')
const baseConfig = require('webpack.base.config.js')

const devConfig = { 
	// ...
}
module.exports = merge(baseConfig, devConfig)
```

基于环境变量区分：借助`cross-env`

## webpack原理

实现一个webpack_require来实现自己的模块化，把代码都缓存在installedModules里，代码文件以对象传递进来，key是路径，value是包裹的代码字符串，并且代码内部的require，都被替换成了webpack_require。

执行`npx webpack`，读取配置文件，

- entry，得到入口文件
- 是否有依赖？递归实现依赖是否有依赖
- 内容是什么？es6+ 转换成 es5
- 处理后的chunk内容
- 生成bundle文件

过程：

- 分析入口内容，处理成浏览器可用的
- 递归处理所有依赖模块
  - 引入路径
  - 在项目里的路径
- 生成bundle文件

### 自己实现一个bundle.js

- 模块分析：读取入口文件，分析代码

  ```js
  // bundle.js
  const options = require('./webpack.config.js')
  const Webpack = require('./lib/webpack.js')
  new Webpack(options).run()
  ```

- 拿到入口文件中的依赖，不推荐使用字符串截取，引入的模块名越多，会越麻烦。推荐使用[@babel/parser](https://www.babeljs.cn/docs/babel-parser)的parse方法，这是babel7的工具，返回一个AST抽象语法树

  ```js
  //读取入口文件的内容
  const content = fs.readFileSync(entryFile, "utf-8");
  //! 分析内容 得到AST
  const ast = parser.parse(content, {
      sourceType: "module",
  });
  ```

- 可以根据ast.program.body里的分析结果，遍历出所有的引入模块，推荐使用[@babel/traverse](https://www.babeljs.cn/docs/babel-traverse)，

  ```js
  traverse(ast, {
      ImportDeclaration({ node }) {
          //拿到模块依赖在项目中的路径
          // ./a.js
          // ./src/index.js
          // path.dirname(entryFile);
          const newPath =
                "./" + path.join(path.dirname(entryFile), node.source.value);
          yilai[node.source.value] = newPath;
      },
  });
  ```

- 把代码处理成浏览器可运行的代码，需要借助[@babel/core](https://www.babeljs.cn/docs/babel-core)和[@babel/preset-env](https://www.babeljs.cn/docs/babel-preset-env)，把ast语法树转换成合适的代码

  ```js
  // 处理内容 转换代码
  const { code } = transformFromAst(ast, null, {
      //处理成什么标准的代码？
      presets: ["@babel/preset-env"],
  });
  ```

- 分析依赖，把项目路所有的模块进行分析

  ```js
  //启动函数
  const info = this.parse(this.entry); //./src/a||b.js
  this.modules.push(info);
  for (let i = 0; i < this.modules.length; i++) {
      const item = this.modules[i];
      const { yilai } = item;
      if (yilai) {
          for (let j in yilai) {
              this.modules.push(this.parse(yilai[j]));
          }
      }
  }
  // 数组结构转换
  const obj = {};
  this.modules.forEach((item) => {
      obj[item.entryFile] = {
          yilai: item.yilai,
          code: item.code,
      };
  });
  ```

  