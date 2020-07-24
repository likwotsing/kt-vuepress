# package.json

## 文档

[官网地址](https://docs.npmjs.com/files/package.json.html)

## 概念

- 在node.js中，有模块的概念，这个模块可以是一个库、框架、项目等。这个模块的描述文件就是package.json
- 它是一个标准的json对象，描述了项目的配置信息(名称、版本、许可证等元数据)以及所需要的各种模块
- `npm install`命令会根据这个配置文件，自动下载依赖的模块，配置运行和开发环境

## 创建案例代码

- 创建项目目录

  ```js
  mkdir package-learn && cd package-learn
  ```

- 初始化

  ```js
  npm init -y
  ```

- package.json生成

  ```js
  {
    "name": "kt-webpack",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/likwotsing/kt-webpack.git"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "bugs": {
      "url": "https://github.com/likwotsing/kt-webpack/issues"
    },
    "homepage": "https://github.com/likwotsing/kt-webpack#readme"
  }
  ```

## package.json核心字段

### name

包的名称，发布到npm平台上显示的名称，业务引入是`require(name)`的名称。

**规范**

- 唯一
- 名称不能以点或下划线开头
- 新包的名称中不能有大写字母

### version

包版本，对于业务项目来说，这个往往不太重要，但是如果要发布自己的项目，这个就显得十分重要了。name和version共同决定了唯一一份代码。npm使用[npm-semver](https://docs.npmjs.com/misc/semver.html)来解析版本号的。

npm模块的完整版本号一般是**【主版本.次要版本.小版本】**

- 主版本：大的变动，可能影响了向后的兼容性
- 次要版本：增加了新的特性不改变已有特性
- 小版本：修改bug或其他小的改动

### preferGlobal

布尔值，表示当用户不将该模块安装为全局模块时(即不使用-global参数)，要不要显示警告，表示该模块的本意就是安装为全局模块

### description

字符串，包的描述，发布包之后，用户在npmjs.com搜索包名后，显示的描述

### keywords

字符串数组，其作用与描述相似。npm注册表会为该字段建立索引，能够在有人搜索软件包时帮助找到他们。

如果不准备发布包，这个字段就没什么用。

### peopel

- author：字符串/对象，项目的作者，对象可包括name、email、url
- contributors：数组，项目的贡献者

### homepage

主页信息，一个表示项目首页的url

### bugs

接收问题反馈的url地址，也可以是email地址。一般是github项目下的issues

### repository

项目源代码仓库的位置，如果git项目是托管在github上的，那么`npm docs`命令是能够找到的

### files

数组，包下载完成时包括的所有文件

作用和gitignore类似，只不过作用相反，如果要包含所有文件可以使用[*]表示

### private

如果设置为`true`，则无法通过`npm publish`发布代码

### engines

包所依赖的node环境、npm版本

### main

包的主要入口，启动包的文件

> 可以指定项目的主要的入口，用户安装使用，require()就能返回入口文件的export module.exports暴露的对象

### license

包的许可证

[阮一峰老师许可证文档](http://www.ruanyifeng.com/blog/2011/05/how_to_choose_free_software_licenses.html)

## 依赖包管理

npm 支持5种依赖包管理类型

1. dependencies：应用依赖/业务依赖
2. devDependencies：开发依赖
3. peerDependencies：同伴依赖
4. bundledDependencies/bundleDependencies：打包依赖
5. optionalDependencies：可选依赖

平时用的依赖第dependencies，devDependencies，其他三种依赖在发布到npm时才会用到。

### dependencies业务依赖

- 列出项目使用的所有依赖项
- 使用npm CLI安装软件包时，将下载到node_modules/文件夹中，并将一条目添加到依赖属性中
- 用于指定应用依赖的外部包，一些依赖是应用发布上线后，正常执行时所需要的。**一定要考虑这个包在线是否用的到，不要全部放到dependencies中，增加打包的体积和效率**

通过以下命令安装依赖会放在dependencies：

```js
npm i packageName --save
npm i packageName -S
npm install packageName --save
npm install packageName -S
npm i packageName // npm 5.x版本，不添加--save/-S参数时，就会把依赖添加到dependencies里
```

>如果没有指定版本，直接写一个包的名字，则安装当前npm仓库中这个包的最新版本。如果要指定版本的，可以把版本号写在包后面，如`npm i vue@2.6.10 -S`

在依赖版本中看到的插入符号(`^`)和波浪号(`~`)是semVer中定义的版本范围的表示法：

```json
"depencencies": {
    "foo": "1.0.0 - 2.9.9", // 指定版本范围
    "bar": ">=1.0.2 <2.1.2",
    "baz" : ">1.0.2 <=2.3.4",
    "boo" : "2.0.1", // 指定版本
    "qux" : "<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2  <3.0.0",
    "asd" : "http://asdf.com/asdf.tar.gz", // 指定包地址
    "til" : "~1.2", // 最近可⽤用版本
    "elf" : "~1.2.3",
    "elf" : "^1.2.3", // 兼容版本
    "two" : "2.x", // 2.1、2.2、...、2.9皆可⽤用
    "thr" : "*", // 任意版本
    "thr2": "", // 任意版本
    "lat" : "latest", // 当前最新
    "dyl" : "file:../dyl", // 本地地址
    "xyz" : "git+ssh://git@github.com:npm/npm.git#v1.0.27", // git 地址
    "fir" : "git+ssh://git@github.com:npm/npm#semver:^5.0",
    "wdy" : "git+https://isaacs@github.com/npm/npm.git",
    "xxy" : "git://github.com/npm/npm.git#v1.0.27"
}
```

版本匹配：

- 指定版本：如`1.1.1`，遵循“大版本.次要版本.小版本”的格式规定，安装时只安装指定版本
- 波浪号(tilde) + 指定版本：比如`~1.2.2`，表示安装1.2.x的最新版本(不低于1.2.2)，但是不安装1.3.x，也就是说安装时**不改变大版本号和次要版本号**
- 插入好(caret) + 指定版本：如`^1.2.2`， 表示安装1.x.x的最新版本(不低于1.2.2)，但是不安装2.x.x，也就是说安装时**不改变大版本号**。需要注意的是，如果大版本号为0，则插入号的行为与波浪号相同，这是因为此时处于开发阶段，即使次要版本号变动，也可能带来版本的不兼容
- latest：安装最新版本

### devDependencies开发依赖

- 项目开发时需要的依赖，不是线上代码的一部分。通常是单元测试或者打包工具。

通过以下安装命令会把依赖放到devDependencies：

```js
npm i packageName --save-dev
npm i packageName -D
npm install packageName --save-dev
npm install packageName -D
```

### peerDependencies同伴依赖

作用是提示宿主环境去安装插件在`peerDependencies`中所指定依赖的包，最终解决插件与依赖包不一致的问题。

`element-ui@2.6.3`只是提供一套基于vue的ui组件库，但他要求宿主环境需要安装指定的vue版本，所以在elementui项目中的package.json中有一个配置：

```json
"peerDependencies": {
    "vue": "^2.5.16"
}
```

### bundledDependencies打包依赖

这种依赖和`npm pack`打包命令有关

```json
{
    "name": "front-end",
    "version": "1.0.0",
    "dependencies": {
    "fe1": "^0.3.2",
        ...
    },
    "devDependencies": {
        ...
        "fe2": "^1.0.0"
    },
    "bundledDependencies": [
        "fe1",
        "fe2"
    ]
}
```

执行打包命令`npm pack`，会生成`front-end`-1.0.0.tgz压缩包，并且该压缩包中包含fe1和fe2两个安装包，这样使用者执行`npm install front-end-1.0.0.tgz`也会安装这两个依赖。

> 在bundledDependencies中指定的依赖包，必须先在dependencies和devDependencies声明过，否则打包会报错

### optionalDependencies可选依赖

这种依赖中的依赖项即使安装失败了，也不影响整个安装的过程。需要注意的是，如果一个依赖同时出现在dependencies和optionalDependencies中，那么optionalDevDependencies会获得更高的优先级，可能造成一些预期之外的效果，所以尽量避免这种情况发生。

## package-lock.json

执行`npm install`的时候，会在当前目录生成一个`package-lock.json`文件，这个文件记录当前状态下实际安装的各个npm package的具体来源和版本号。**用于依赖包版本管理**

- 在大版本相同的前提下，如果一个模块在`package.json`中的小版本要大于`package-lock.json`中的小版本，则在执行`npm install`时，会将该模块更新到大版本下的最新的版本，并将版本号更新至`package-lock.json`。如果小于，则被`package-lock.json`中的版本锁定
- 如果一个模块在`package.json`和`package-lock.json`中的大版本不相同，则在执行`npm install`时，都将根据`package.json`中大版本下的最新版本进行更新，并将版本号更新至`package-lock.json`中
- 如果一个模块在`package.json`中有记录，而在`package-lock.json`中无记录，执行`npm install`后，则会在`package-lock.json`生成该模块的详细记录。同理，一个模块在`package.json`中无记录，而在`package-lock.json`中有记录，执行`npm install`后，则会在`package-lock.json`中删除该模块的详细记录。

## scripts

scripts是npm CLI用来运行项目任务的强大工具。他们可以完成开发过程中大多数任务，指定脚本命令的npm命令行缩写。

npm脚本的原理：当执行`npm run `，就会自动新建一个shell，在这个shell里面执行指定的脚本命令。因此，只要是shell(一般是bash)可以运行的命令，就可以写在npm脚本里面。

```json
"scripts": {
    "test": "tap test/index.js",
    "start": "node index.js",
    "build": "webpack --config build.js"
}
```

`npm run`新建的shell，会将当前目录的`node_modules/.bin`子目录加入PATH变量，执行结束后，再将PATH变量恢复原样。因此，当前目录的node_modules/.bin子目录里面的所有脚本，都可以直接用脚本名调用，而不必加上路径。

```json
"scripts": { "test": "tap test/index.js" }
```

而不是：

```json
"scripts": { "test": "node_modules/./bin/tap test/index.js" }
```

### npm run

执行`npm run`可以列出所有可以执行的脚本命令

### cross-env

运行跨平台设置和使用环境变量的脚本

windows不支持NODE_ENV=development的设置方式，cross-evn能够提供一个设置环境变量的scripts，让用户能够以unix方式设置环境变量，然后在windows上也能兼容运行

```js
// 安装
npm install --save-dev cross-env

// 使用
"scripts": {
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
}
```

### *通配符

*表示任意文件名，**表示任意一层子目录。

如果要将通配符传入原始命令，防止被shell转义，要将星号转义：

```js
"test": "tap test/\*.js"
```

### 脚本传参符号：--

```json
"serve": "webpack-dev-server --mode=development --open --iframe=true"
```

### 脚本执行顺序

**并行执行**(即同时的平行执行)，可以使用`&`符号：

```js
npm run script1.js & npm run script2.js
```

**继发执行**(即只有前一个任务成功，才执行下一个任务)，可以使用`&&`符号：

```js
npm run script1.js && npm run script2.js
```

### 脚本钩子

npm脚本有pre和post两个钩子，前者是在脚本运行前，后者是在脚本运行后执行，所有的命令脚本都可以使用钩子(包括自定义的脚本).

如：运行`npm run build`，会按一下顺序执行：

`npm run prebuild` --> `npm run build` --> `npm run postbuild`

```json
"clean": "rimraf ./dist && mkdir dist",
"prebuild": "npm run clean",
"build": "cross-env NODE_ENV=production webpack"
```

[npm默认提供的钩子](https://docs.npmjs.com/using-npm/scripts)

### 常用脚本命令

```json
"clean": "rimraf dist/*", // 删除目录
"serve": "http-server -p 9090 dist/", // 本地搭建一个 HTTP服务
"open:dev": "opener http://localhost:9090", // 打开浏览器
"livereload": "live-reload --port 9091 dist/", // 实时刷新
"build:html": "jade index.jade > dist/index.html", // 构建HTML文件
"watch:css": "watch 'npm run build:css' assets/styles/", // 只要css文件有变动，就重新执行构建
"watch:html": "watch 'npm run build:html' assets/html", // 只要HTML文件有变动，就重新执行构建
"build:favicon": "node scripts/favicon.js" // 构建favicon
```

### 拿到package.json的变量

npm脚本有一个非常强大的功能，就是可以使用npm的内部变量。

通过npm_package_前缀，npm脚本可以拿到package.json里面的字段，如：

```json
{
    "name": "foo",
    "version": "1.2.3",
    "scripts": {
        "view": "node index.js"
    }
}
```

可以在自己的js中写：

```js
console.log(process.env.npm_package_name) // foo
console.log(process.env.npm_package_version) // 1.2.3
```

### bin

package.json中的bin，表示一个可执行文件到指定文件源的映射。通过`npm bin`命令显示当前项目的`bin`目录的路径。

如在`@vue/cli`的package.json中：

```js
"bin": {
    "vue": "bin/vue.js"
}
```

如果全局安装`@vue/cli`的话，`@vue/cli`源文件会被安装在全局源文件安装目录下(`/user/local/lib/node_modules`)，而`npm`会在全局执行`bin`文件安装目录(`/user/local/bin`)下创建一个指向`/user/local/lib/node_moduels/@vue/cli/bin/vue.js`文件的名为`vue`的软连接，这样就可以直接在终端输入`vue`来执行相关命令。

>  @vue/cli全局安装后：C:\Users\admin\AppData\Roaming\nvm\v12.18.2\node_modules\@vue\cli
>
> - 使用了nvm，目前使用的node版本是12.18.2

如果局部安装`@vue/cli`的话，npm会在本地项目`./node_modules/.bin`目录下创建一个指向`./node_modules/@vue/cli/bin/vue.js`名为`vue`的软连接，这个时候需要在终端中输入`./node_modules/.bin/vue`来执行(也可以使用`npx vue`命令来执行,[npx](https://github.com/npm/npx)的作用就是为了方便调用项目内部安装的模块)

> 软连接(符号链接)是一类特殊的可执行文件，其包含有一条以绝对路径或者相对路径的形式指向其他文件或目录的引用。在bin目录下执行`ll`指令可以查看具体的软连接指向。在对链接文件进行读或写操作的时候，系统会自动把该操作转换为对源文件的操作，但删除链接文件时，系统仅仅删除链接文件，而不删除源文件本身。

范例：

```js
npm init -y // 创建一个package.json文件
```

```json
{
    "bin": {
        "ok": "./index.js"
    },
    ...
}
```

在package.json同目录下创建一个index.js文件，内容如下：

```js
#!/usr/bin/env node
console.log('hello')
```

- #!：符号名称，指定文件的执行程序
- /usr/bin/env：执行程序的位置
- node：使用node

在项目目录下执行：

```js
npm install -g
```

在任意的cmd窗口输入`ok`，都可以看到`hello`

卸载：

```js
npm uninstall -g
```

