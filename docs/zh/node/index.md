---
sidebarDepth: 2
sidebar: auto
---

# Node

[node中文文档](https://www.npmjs.cn/)

console打印时可以使用的格式化：[console对象](https://developer.mozilla.org/zh-CN/docs/Web/API/Console#Outputting_text_to_the_console)、[规范](https://console.spec.whatwg.org/#formatting-specifiers)

## 模块

在JavaScript中，通常把代码分为几个js文件，然后在浏览器中将这些js文件合并运行，但是在Node.js中，是通过以**模块**为单位来划分所有功能的。每一个模块为一个js文件，每一个模块中定义的全局变量和函数的作用范围也被限定在这个模块之内，只有使用`exports`对象才能传递到外部使用。

### module.exports和exports

[参考module.exports](https://nodejs.org/api/modules.html#modules_module_exports)

每次导出接口的时候都通过`module.exports.xxx = xxx`的方式很玛法，Node.js专门提供了一个exports等于`module.exports`，也就是说在模块中默认有这样一句代码：

```js
var exports = module.exports
exports = {
    a: 3
}
console.log(exports)
console.log(module.exports)
```

> 注意，就像其他变量一样，如果一个新的值被赋值给exports，它就不再绑定到`module.exports`了。同样的给`module.exports`重新赋值也会断开它们之间的引用，但最终导出的是`module.exports`，上面的例子中导出的是{}, 而不是{a:3}

`require()`得到的是`module.exports`导出的值，导出多个成员可以用`module.exports`和`exports`，导出单个成员只能用`module.exports`。

可以通过重新赋值来绑定`exports`和`module.exports`的关系：

```js
module.exports = exports = function foo() {}
```

### http

http模块主要用于搭建HTTP服务端和客户端

```js
var http = require('http')
http.createServer(function(request, res) {
    res.writeHead(200, {
        'content-type': 'text/json'
    })
    res.end('Hello world222\n')
}).listen(8080)
console.log('Server running at http://127.0.0.1:8080')
```

`response.write()`发送一块响应主体，也就是用来给客户端发送响应数据，可以直接写文本信息，也可以写html代码，注意要设置Content-Type的值。write可以使用多次，但是最后一定要使用end来结束响应，否则客户端会一直等待。

[Content-Type参照表](https://tool.oschina.net/commons)

常用的值有：

- text/html：html格式
- text/plain：纯文本格式
- application/x-www-form-urlencoded：数据被编码为名称/值对

`response.end()`向服务器发出信号，表示已发送所有响应头和主体，该服务器应该视为此消息完成。必须在每个响应上调用方法`response.end()`。

#### request

- request.url获取请求路径，获取到的是端口号之后的那一部分路径，也就是说所有的url都是以/开头，判断路径处理响应的
- request.socket.localAddress获取IP地址
- request.socket.remotePort获取源端口

```js
var http = require('http')
var server = http.createServer()
server.on('request', (req, res) => {
    console.log('收到请求了，请求路径是：' + req.url)
    console.log(
        "请求我的客户端地址是：",
        req.socket.remoteAddress,
        req.socket.remotePort
    )
    var url = req.url
    res.writeHead(200, {
        'Content-type': 'text/html;charset-utf-8'
    })
    if (url === '/') {
        res.end('<h1>Index Page</h1>')
    } else if (url === '/login') {
        res.end(`<h1>Login Page</h1>`)
    } else {
        res.end(`404 Not Found.`)
    }
})
server.listen(9090, function() {
    console.log('Server running at http://127.0.0.1:9090')
})
```

### fs

所有文件系统操作都具有同步和异步的形式。异步方法中回调函数的第一个参数总是留给异常参数（exception），如果方法成功完成，那么这个参数为null或者undefined。

在Node.js中大部分需要在服务器运行期反复执行的业务逻辑代码，必须使用异步代码。否则，同步代码在执行期间，服务器将停止响应，因为Node.js是单线程的。

服务器启动时如果需要读取配置文件，或者结束时需要写入到状态文件时，可以使用同步代码，因为这些代码只在启动或结束时执行一次，不影响服务器正常运行时的异步执行。

[中文文档](http://nodejs.cn/api/fs.html)

[英文文档](https://nodejs.org/api/fs.html)

[文件操作权限](http://nodejs.cn/api/fs.html#fs_file_system_flags)

#### 打开文件

[异步打开文件](http://nodejs.cn/api/fs.html#fs_fs_open_path_flags_mode_callback)的语法格式：

```js
fs.open(path, flags, [,mode], callback)
```

- path：文件的路径
- flags：文件打开的行为，默认是r，用于读取
- mode：设置文件模式（权限），默认为0o666（可读写）
- callback：回调函数，带有2个参数：callback(err, fd)

```js
var fs = require('fs')
fs.open('input.txt', 'r+', (err, fd) => { // r+，可读写
    if (err) {
        return console.error(err)
    }
    console.log('文件打开成功')
})
```

同步打开文件的语法格式：

```js
fs.openSync(path, flags, [,mode])
```

异步关闭文件的语法：

```js
fs.close(fd, callback)
```

- fd：通过fs.open()方法返回的文件描述符
- callback：回调函数，除了可能的异常，完成回调没有其他参数

```js
var fs = require('fs')
fs.open('input.txt', 'r+', (err, fd) => {
    if (err) {
        return console.error(err)
    }
    console.log('文件打开成功')
    fs.close(fd, err => {
        if (err) {
            console.log(err)
        }
        console.log('文件关闭')
    })
})
```

#### 读取文件

使用`fs.read()`和`fs.write()`读写文件需要使用`fs.open()`打开文件和`fs.close()`关闭文件。

[异步读取文件](http://nodejs.cn/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback)：

```js
fs.read(fd, buffer, offset, length, position, callback)
```

- fd：通过`fs.open()`方法返回的文件描述符
- buffer：数据写入的缓冲区
- offset：缓冲区中开始写入的偏移量，一般它的值写为0
- length：整数，要读取的字节数
- position：指定文件中开始读取的位置，如果position为null，则从当前位置读取数据，并更新文件位置
- callback：有3个参数
  - err：错误信息
  - byteRead：读取的字节数
  - buffer：缓冲区对象

```js
// read.js
var fs = require('fs')
fs.open('test.txt', 'r+', (err, fd) => {
    if (err) {
        return console.error(err)
    }
    console.log('文件打开成功')
    console.log('准备读取文件')
    var buf = Buffer.alloc(1024) // 创建大小为1024字节的缓存区
    fs.read(fd, buf, 0, buf.length, 0, (err, bytes, buf) => {
        if (err) {
            console.log(err)
        }
        console.log(bytes + '字节被读取')
        if (bytes > 0) { // 仅输出读取的字节
            console.log(buf.slice(0, bytes).toString())
        }
        fs.close(fd, err => { // 异步关闭文件
            if (err) {
                console.log(err)
            }
            console.log('文件关闭成功')
        })
    })
})
// test.txt
hello world
```

**使用fs.write写入文件**

异步写入文件的语法：

```js
fs.write(fd, buffer, offset, length, position, callback)
```

- fd：从指定的文件写入数据
- buffer：数据写入的缓冲区
- offset：注定要写入的buffer部分
- length：整数，要写入的字节数
- position：指定应写入此数据的文件开头的偏移量，如果`typeof position !== number`，则从当前位置写入数据
- callback：有3个参数
  - err：错误信息
  - byteWritten：指定从buffer写入的字节数
  - buffer：缓冲区对象

```js
// write.js
var fs = require('fs')
fs.open('test.txt', 'a', (err, fd) => { // 打开文件用于追加
    if (err) {
        return console.error(err)
    }
    console.log('文件打开成功')
    console.log('准备写入文件')
    var buffer = Buffer.from(new String(' hello andy'))
    fs.write(fd, buffer, 0, 11, 0, (err, bytes, buffer) => {
        if (err) {
            throw err
        }
        console.log('写入成功')
        console.log(bytes + '字节被写入')
        console.log(buffer.slice(0, bytes).toString()) // 打印出buffer中存入的数据
        fs.close(fd, err => { // 异步关闭文件
            if (err) {
                console.log(err)
            }
            console.log('文件关闭成功')
        })
    })
})
```

**另一种写入数据**

[语法格式](http://nodejs.cn/api/fs.html#fs_fs_write_fd_string_position_encoding_callback)为：

```js
fs.write(fd, string[, postion[, encoding]], callback)
```

```js
// write2.js
var fs = require('fs')
fs.open('test.txt', 'a', (err, fd) => {
    if (err) {
        return console.log(err)
    }
    console.log('文件打开成功')
    console.log('准备写入文件')
    var data = ' hello bob'
    fs.write(fd, data, 0, 'utf-8', (err, bytes, buffer) => {
        if (err) {
            return console.log(err)
        }
        console.log(bytes + '字节被写入')
        console.log(buffer)
        fs.close(fd, err => {
            if (err) {
                console.log(err)
            }
            console.log('文件关闭成功')
        })
    })
})
```

> `fs.read`和`fs.write`需要结合`fs.open`得到文件句柄来使用，其实还有另一种读写方式。

#### readFile读取文件

异步读取文件的语法：

```js
fs.readFile(path, [options], callback)
```

- path：文件名或文件描述符
- options：是个对象或字符串
  - encoding：默认值为null
  - flag：默认值为‘r'
- callback：回调函数

```js
// readFile.js
var fs = require('fs')
fs.readFile('test.txt', (err, data) => {
    if (err) {
        throw err
    }
    console.log(data)
})
```

默认输出的原始二进制数据在缓冲区中的内容，如果要显示文件内容有2种办法：

- 使用`toString()`， console.log(data.toString())
- 设置输出编码，fs.readFile('test.txt', 'utf-8', (err, data) => {})

`fs.readFileSync(filename, [options])`是`readFile`的同步方法。

#### 获取文件信息

[异步获取文件信息](http://nodejs.cn/api/fs.html#fs_class_fs_stats)的语法：

```js
fs.stat(path, callback)
```

- path：文件路径
- callback：有2个参数
  - err：err.code是常见的系统错误
  - stats：fs.stats对象

```js
var fs = require('fs')
fs.stat('test.txt', (err, stats) => {
    console.log(stats.isFile()) // 判断是否为文件
})
```

> 不建议在调用fs.open()、fs.readFile()、fs.writeFile()之前使用fs.stat()检查文件是否存在。而是应该直接打开、读取、写入文件，并在文件不可用时处理引发的错误。

#### 截取文件

[异步截取文件](ftruncate)的语法：

```js
fs.ftrancate(fd[, len], callback)
```

- fd：通过fs.open()方法返回的文件描述符
- len：文件内容截取的长度，默认为0
- callback：回调函数

```js
// ftr.js
var fs = require('fs')
fs.open('test.txt', 'r+', (err, fd) => { // 读取或写入
    if (err) {
        return console.error(err)
    }
    console.log('文件打开成功')
    console.log('截取6字节内的文件内容，超出部分将被去除')
    var buf = Buffer.alloc(1024)
    fs.ftruncate(fd, 6, err => {
        if (err) {
            console.log(err)
        }
        console.log('文件截取成功')
        console.log('读取相同的文件')
        fs.read(fd, buf, 0, buf.length, 0, (err, bytes) => {
            if (err) {
                console.log(err)
            }
            if (bytes > 0) { // 仅输出读取的字节
                console.log(buf.slice(0, bytes).toString()) // This i
            }
            fs.close(fd, err => { // 关闭文件
                if (err) {
                    console.log(err)
                }
                console.log('文件关闭成功')
            })
        })
    })
})
// test.txt
This is test.txt.
```

#### 删除文件

删除文件的语法：

```js
fs.unlink(path, callback)
```

```js
// fsU.js
var fs = require('fs')
fs.unlink('test.txt', err => { // 删除文件
    if (err) {
        return console.error(err)
    }
    console.log('文件删除成功')
})
```

> 不要理所应当第认为**新建文件**就是fs.link，虽然有个方法，但是他的作用不是新建文件，新建文件使用[fs.writeFile](http://nodejs.cn/api/fs.html#fs_fs_writefile_file_data_options_callback)

#### 修改文件名

异步修改文件名的语法：

```js
fs.rename(oldPath, newPath, callback)
```

```js
// rename.js
var fs = require('fs')
fs.rename('old.txt', 'new.txt', err => {
    if (err) {
        throw err
    }
    console.log('重命名完成')
})
```

#### 目录操作

**新建目录**

异步创建目录的语法：

```js
fs.mkdir(path[, options], callback)
```

- path：文件路径
- options：有2个参数
  - recursive：表示是否以递归的方式创建目录，默认为false
  - mode：设置目录权限，windows不支持，默认为0o777

```js
// mkdir.js
var fs = require('fs')
console.log('创建目录 ./test')
fs.mkdir('./test/', err => {
    if (err) {
        return console.log(err)
    }
    console.log('目录创建成功')
})
```

**读取目录**

异步读取目录的语法：

```js
fs.readdir(path[, options], callback)
```

- path：文件路径
- options：有2个参数
  - encoding：默认为'utf-8'
  - withFileTypes：默认为false

```js
// readdir.js
var fs = require('fs')
fs.readdir('./test', (err, files) => {
    if (err) {
        throw err
    }
    console.log(files)
})
```

**删除目录**

异步删除目录的语法：

```js
fs.rmdir(path, callback)
```

```js
// rmdir.js
var fs = require('fs')
console.log('准备删除目录 ./test')
fs.rmdir('./test', err => {
    if (err) {
        return console.error(err)
    }
})
```



## 循环引用

当循环调用`require()`时，一个模块可能在未完成执行时被返回。

```js
// a.js
console.log('a 开始')
exports.done = false
var b = require('./b.js')
console.log('在 a 中，b.done = %s', b.done)
exports.done = true
console.log('a 结束')
```

```js
// b.js
console.log('b 开始')
exports.done = false
var a = require('./a.js')
console.log('在 b 中，a.done = %s', a.done)
exports.done = true
console.log('b 结束')
```

```js
// main.js
console.log('main 开始')
var a = require('./a.js')
var b = require('./b.js')
console.log('在 main 中，a.done=%o, b.done=%s', a.done, b.done)
```

运行：`node main.js`

```js
// 结果
main 开始
a 开始
b 开始
在 b 中，a.done = false
b 结束
在 a 中，b.done = true
a 结束
在 main 中，a.done=true, b.done=true
```

从结果可以看出，当main.js加载a.js时，a.js又加载b.js，此时，b.js会尝试去加载a.js，为了防止无限的循环，会返回一个a.js的exports对象的未完成的副本给b.js，然后b.js完成加载，并将exports对象提供给a.js模块，最后在main.js中，a.done和b.done都为true。

### 箭头函数

ES6新增了[箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)，没有自己的**this, arguments, super或[new.target](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new.target)**，适用于本来需要匿名函数的地方，不能用作构造函数。

### 事件

大多数Node.js的核心API使用异步事件驱动，某些类型的对象（触发器，Emitter）会触发命名事件来调用函数（监听器，Listener）。可以通过`require('events')`来获得`event`事件，通常，事件名采用“小驼峰”（第一个单词全小写，后面的单词首字母大写，其它字母小写）命名方式。

所有能触发事件的对象都是`EventEmitter`类的实例。这些对象有一个`eventEmitter.on()`函数，用于将一个或多个函数绑定到命名事件上。当`EventEmitter`对象触发一个事件时，所有绑定到该事件上的函数都会被同步地调用。

```js
var events = requier('events') // 引入events模块
var eventEmitter = new events.EventEmitter() // 创建eventEmitter对象
```

#### 监听器顺序

默认情况下，事件监听器会按照添加的顺序依次调用。`emitter.prependListener()`方法可以将事件监听器添加到监听器数组的开头。

```js
var events = require('events')
var emitter = new events.EventEmitter()
emitter.on('connection', function() {
    console.log('我是a') // 后执行
})
emitter.prependListener('connection', () => {
    console.log('我是b') // 先执行
})
setTimeout(function() {
    emitter.emit('connection')
}, 1000)
```

> `emitter.addListener(eventName, listener)`是`emitter.on(eventName, listener)`的别名。注意，是addListener，不是addEventListener

#### 只调用一次的监听器

`eventEmitter.once()`可以注册最多可调用依次的监听器，当事件被触发时，监听器会被注销，其他地方绑定的监听器是不会被注销的。`emitter.prependOnceListener()`可以将事件监听器添加到监听数组的开头，但是使用该方法注册的监听器最多只能调用一次。

#### 移除监听器

`removeListener()`最多只会从监听器数组中移除一个监听器。可以多次调用来一个个地移除我们需要移除的监听器。

>  注意：**一旦事件被触发**，所有绑定到该事件的监听器都会按顺序依次调用。也就是说在事件触发之后、且最后一个监听器执行完成之前，`removeListener()`或`removeAllListener()`不会从`emit()`中移除他们。

```js
var events = require('events')
var emitter = new events.EventEmitter()
var cb1 = function() {
    console.log('我是1')
    // emitter.removeListener('connection', cb2) // 第一次还会执行cb2
}
var cb2 = function() {
    console.log('我是2')
}
emitter.on('connection', cb1)
emitter.on('connection', cb2)
emitter.removeListener('connection', cb2) // 第一次就不会执行cb2
emitter.emit('connection')
emitter.emit('connection')
```

注意代码中的注释，注意`emit()`和`removeListener()`的顺序。

`emitter.off()`是`emitter.removeListener()`的别名。

`emitter.removeAllListener([eventName])`移除全部监听器或指定的`eventName`事件的监听器。

#### 最大监听器绑定数

默认情况下，事件添加超过10个监听器，则`EventEmitter`会打印一个警告，可以使用`emitter.setMaxListeners()`方法指定`EventEmitter`实例个数，当设为Infinity（或0）时表示不限制监听器的个数。

**查看事件绑定的监听器个数**

使用`emitter.listenerCount(eventName)`查看事件绑定的监听器个数。

#### error事件

当`EventEmitter`实例出错时，应该触发`error`事件。

如果没有为`error`事件注册监听器，当`error`事件触发时，会抛出错误、打印堆栈跟踪、并退出Node.js进程。

通常要为触发error事件的对象设置监听器，避免遇到错误后整个程序崩溃。

```js
var events = require('events')
var emitter = new emitter.EventEmitter()
emitter.on('error', err => {
    console.log('发生错误了')
})
emitter.emit('error')
```

