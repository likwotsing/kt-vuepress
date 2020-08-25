# HTTP缓存

## Web缓存

### 目的

当浏览器加载一个面时，html引用的外部资源也会加载，但有些资源是不经常变化的，如图片、css、js，如果每次都加载这些资源势必会带来资源的浪费，而且加载时间过长也会影响用户体验。

HTTP缓存技术就是为了解决这个问题的。简单的讲HTTP缓存就是讲静态资源存储在浏览器内部，下次请求相同资源时可以直接使用。

当然何时使用何时不使用要有一些策略保证，如果资源一旦更新，缓存也要随之更新。

### 作用

- 提高首屏加载速度，优化用户体验
- 减少流量消耗
- 减轻服务器压力

```js
// index.js
const http = require('http')

function updateTime() {
  setInterval(() => this.time = new Date().toUTCString(), 1000)
  return this.time
}

http.createServer((req, res) => {
  const { url } = req
  if (url === '/') {
    res.end(`
      <html>
        html updatetime is: ${updateTime()}
        <script src="main.js"></script>
      </html>
    `)
  } else if (url === '/main.js') {
    const content = `document.writeln('<br />js updatetime is: ${updateTime()}')`
    // 强缓存
    // res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toUTCString())
    // res.setHeader('Cache-Control', 'max-age=5')
    // 协商缓存
    res.setHeader('Cache-Control', 'no-cache')
    // res.setHeader('Last-Modified', new Date().toUTCString())
    // if (new Date(req.headers['if-modified-since']).getTime() + 3 * 1000 > Date.now()) {
    //   console.log('协商缓存命中...')
    //   res.statusCode = 304
    //   res.end()
    //   return
    // }
    const crypto = require('crypto')
    const hash = crypto.createHash('sha1').update(content).digest('hex')
    res.setHeader('etag', hash)
    if (req.headers['if-none-match'] === hash) {
      console.log('etag 缓存命中...')
      res.statusCode = 304
      res.end()
      return
    }
    res.statusCode = 200
    res.end(content)
  } else if (url === '/favicon.ico') {
    res.end('')
  }
}).listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})

```

[http message.headers](http://nodejs.cn/api/http.html#http_message_headers)

[http2 message.headers](https://nodejs.org/dist/latest-v12.x/docs/api/http2.html#http2_headers_object)

- node里的headers都是**小写**，如`if-none-match`

## 强缓存策略

直接从本地副本比对读取，**不去请求服务器**，返回的状态码是**200**。

可能存在的问题是如果不去服务器请求，如果静态资源更新了而浏览器还在使用旧的静态资源怎么办呢？答案是使用定时器的方式，也就是强缓存可以设置静态资源的有效期。如果超过有效期就认为缓存作废。

### HTTP1.0

#### expires

[expires](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Expires)是`HTTP1.0`中定义的缓存字段。当请求一个资源，服务器返回时，可以在`Response Headers`中增加`expires`字段表示资源的过期时间。

```js
expires: Mon, 24 Aug 2020 06:55:26 GMT
```

它是一个**时间戳**（准确的说应该叫[格林尼治]([https://baike.baidu.com/item/%E6%A0%BC%E6%9E%97%E5%B0%BC%E6%B2%BB/3065623#viewPageContent](https://baike.baidu.com/item/格林尼治/3065623#viewPageContent))时间），当客户端再次请求该资源的时候，会把客户端时间与该时间戳进行对比，如果大于该时间戳则已过期，否则直接使用该缓存资源。

但是有个问题，发送请求时使用的是**客户端时间**去对比。

- 客户端和服务器端时间可能快慢不一致
- 客户端的时间是可以自行修改的(如浏览器是跟随系统时间的，用户可以修改电脑的系统时间)

解决的办法是使用HTTP1.1的`cache-control`

### HTTP1.1

#### cache-control

HTTP1.1新增了[cache-control](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control)字段来解决`expires`存在的问题，**当`cache-control`和`expires`都存在时，`cache-control`的优先级更高**。该字段是一个时间长度，单位秒，表示该资源经过多少秒后失效。当客户端请求资源的时候，发现该资源还在有效时间内则使用该缓存，它**不依赖客户端时间**。`cache-control`主要有`max-age`和`s-maxage`、`public`和`private`、`no-cache`和`no-store`等值。

##### 可缓存性

| 指令名称 |                             说明                             |
| -------- | :----------------------------------------------------------: |
| public   | 所有内容都将被缓存(客户端和代理服务器都可以缓存)，如：可以缓存请求方法为POST的请求 |
| private  | 只能被单个用户缓存，不能作为共享缓存(即代理服务器不能缓存)，即客户端可以缓存 |
| no-cache |                需要使用协商缓存来验证缓存数据                |
| no-store |                          不使用缓存                          |

##### 到期

| 指令名称            | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |
| max-age=\<seconds\> | 超过seconds后被认为过期(秒)，与`expires`相反，时间是相对于请求的时间。这个选项只在HTTP1.1可用，在和Last-Modified一起使用时，优先级较高 |

##### 重新验证和重新加载

| 指令名称         | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| must-revalidate  | 如果缓存的内容失效，请求必须发送到服务器/代理以进行重新验证  |
| proxy-revalidate | 和must-revalidate作用相同，仅适用于共享缓存(如代理)，并被私有缓存忽略 |



## 协商缓存

强缓存的`expires`和`cache-control`都会**访问本地缓存直接验证**是否过期，如果没过期直接使用本地缓存，并返回200。但如果设置了`no-cache`和`no-store`则本地缓存会被忽略，会去**请求服务器验证资源是否更新**，如果没有更新才继续使用本地缓存，此时返回的是304，这就是协商缓存。协商缓存主要包括`last-modified`和`etag`。

协商缓存简单的说就是浏览器和服务器间就是否要使用缓存在做协商。如果协商的结果是需要更新就会返回200并返回更新内容；如果不需要只需要返回状态码304不用返回内容，这样虽然需要后端应答但是后端既不需要生成内容也不需要传输内容，依然可以享受缓存的好处。

### last-modified & if-Modified-Since

通过协商修改时间为基础的策略。

- if-modified-since：只可以用在GET和HEAD请求中

![last-modified](/assets/img/last-modified.png)

### etag & if-None-Match

通过内容判断，一般的做法是将返回内容进行摘要(Hash)，然后通过对比摘要来判断内容是否更新。

- `if-none-match`是在http2的模块里
- if-none-match和if-match的区别：if-match是**强比较算法**，只有在每一个字节相同的情况下，才认为两个文件是相同的。if-none-match是**弱比较算法**，内容一致也可以认为是相同的。
- if-none-match比if-modified-since的优先级高

![etag](/assets/img/etag.png)

## AJAX缓存

## ServiceWorker

