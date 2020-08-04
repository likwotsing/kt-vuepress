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

[npm库](https://github.com/node-webot/co-wechat)

[开通公众号测试账号](https://mp.weixin.qq.com/)：开发 -> 开发者工具 -> 公众平台测试账号

编写配置文件：

```js
// conf.js

```

