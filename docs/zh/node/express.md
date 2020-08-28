# Express

Node本身并不支持常见的web开发任务。如果需要处理一些HTTP请求、处理不同URL路径的请求(路由)、用模板来动态创建响应，就需要自己编写代码实现，所以出现了一些web框架，如Express。

Express有如下机制：

- 为不同URL路径中使用不同HTTP动词的请求(路由)编写处理程序。
- 集成“视图“渲染引擎，可以将数据插入模板生成响应。
- 设置常见的web应用，如连接的端口、渲染响应模板的位置
- **在请求处理的任何位置添加额外的请求处理"中间件"**

## 中间件

- 中间件可以执行任何操作，运行任何代码，更改请求和响应对象，也可以**结束“请求-响应”周期**。如果它没有结束响应，则必须调用`next()`将控制传递给下一个中间件函数(否则请求将成为悬挂请求)。

- 中间件和路由函数是按声明顺序调用的。中间件的引入顺序很重要(如果会话中间依赖于cookie中间件，则必须先添加cookie处理器)。一般情况下先调用中间件后设置路由，否则路由处理器将无法访问中间件功能。
- 中间件函数和路由处理回调的唯一区别：中间件函数有第三个参数`next`，在中间件不会结束请求周期时应调用这个`next`。

### 使用中间件

```js
const  myMiddleware = (req, res, next) => {
    // ...
    next();
}
// 用use()为所有路由和动词添加该函数
app.use(myMiddleware);
// 用use()为一个特定的路由添加该函数
app.use('/login', myMiddleware);
// 为一个特定的HTTP动词和路由添加该函数
app.get('/', myMiddleware);
```

### static托管静态文件

使用`express.static`中间件类托管静态文件，如图片、CSS、js文件。

```js
app.use(express.static('public')) // 托管public文件夹中的文件
```

通过多次调用`static`来托管多个文件，按调用顺序查找：

```js
app.use(express.static('public'))
app.use(express.static('media'))
```

可以创建一个装载路径：

```js
// 可以通过/media前缀访问public里的文件
// 如: http://localhost:3000/media/images/log.png
app.use('/media', express.static('public'))
```

### 错误处理

处理错误的特殊中间件函数有4个参数(err, req, res, next)，而不是3个。

```js
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send('出错了')
})
```

错误处理中间件可以处理任何内容，但是必须在所有其它`app.use()`和路由调用后才能使用，错误处理中间件是需求处理过程中最后的中间件。

## 渲染数据

模板引擎为输出文档的结构指定一个模板，在数据处先放置占位符，并在页面生成时填充。

