# 公众号

微信公众号：2984088799@qq.com

## sunny-ngrok实现外网的映射

- 先启动本地服务器，如127.0.0.1:3000
- 申请sunny-ngrok隧道，填写隧道配置信息，映射本地端口
- 下载客户端并运行

```js
// index.js
const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const bodyParser = require('koa-bodyparser');
const app = new Koa()
app.use(bodyParser())
const router = new Router()
app.use(static(__dirname + '/'))

app.use(router.routes()); /*启动路由*/
app.use(router.allowedMethods());
app.listen(3000);
```

```html
// index.html
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
  <script src="https://unpkg.com/vue@2.1.10/dist/vue.min.js"></script>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="https://unpkg.com/cube-ui/lib/cube.min.js"></script>
  <script src="https://cdn.bootcss.com/qs/6.6.0/qs.js"></script>
  <script src="http://res.wx.qq.com/open/js/jweixin-1.4.0.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/cube-ui/lib/cube.min.css">
  <style>
    /* .cube-btn {
            margin: 10px 0;
        } */
  </style>
</head>

<body>
  <div id="app">
    <cube-input v-model="value"></cube-input>
    <cube-button @click='click'>Click</cube-button>
  </div>
  <script>
    var app = new Vue({
      el: '#app',
      data: {
        value: 'input'
      },

      methods: {
        click: function () {
          console.log('click')
        }
      },
      mounted: function () {

      },
    });
  </script>
</body>

</html>
```

启动：

```bash
node index.js
```

访问：127.0.0.1:3000

申请[sunny-ngrok](http://www.ngrok.cc/)账号后，开通隧道(有一个免费的)，设置 隧道名称、隧道协议，本地端口，会自动分配一个隧道id，[下载对应的操作系统版本](http://www.ngrok.cc/download.html)，windows下执行`.bat`文件，会提示输入隧道id，然后访问赠送的域名。

## 客服消息-你问我答

功能 -> 自动回复，可以设置关键字回复，但是如果需要动态回复或更复杂的逻辑，就需要使用我们自己的服务器，通过微信服务器转发来实现，如下图：

![你问我答](/assets/wx/niwenwoda.png)

[开通公众号测试账号](https://mp.weixin.qq.com/)：开发 -> 开发者工具 -> 公众平台测试账号

[项目代码](https://github.com/likwotsing/kt-wx)

- ./src/index.js：实现后端接口

- ./src/source.js：源代码实现微信的签名验证

  > 验证是：我们自己的服务器验证微信的服务器，把验证代码注释掉，在微信网站的[接口配置](https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index)里也可以通过，说明没有这个签名验证，微信也能使用，但为了安全，其他服务器调用我们的服务器时，需要添加这个验证，如果不是微信服务器调用我们服务器的接口，那就不作进一步处理。

- ./src/conf.js：微信的后端配置

- ./src/sunny-ngrok/：内网映射到外网

- ./src/mongoose.js：票据持久存储，可以使用navicat premium访问mongodb

  > [mongodb](https://www.runoob.com/mongodb/mongodb-window-install.html)，使用命令行的方式启动mongob即可，然后使用navicat premium连接

[co-wechat](https://www.npmjs.com/package/co-wechat)：微信公众平台消息接口服务中间件

[co-wechat-api](https://www.npmjs.com/package/co-wechat-api)：微信公共平台API，可以直接使用，[对应的api文档](https://doxmate.cool/node-webot/co-wechat-api/api.html)

> 使用该模块后，就不用在每个接口里每次都验证签名信息，调用该模块，在new一个实例的时候把appid和appsecret传入一次即可

[crypoty](https://www.liaoxuefeng.com/wiki/1022910821149312/1023025778520640)：Node.js可以调用的加密模块