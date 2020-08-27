# 登录

## Cookie+Session登录

HTTP是一种无状态的协议，客户端每次发送请求时，首先要和服务器建立连接，在请求完成后会断开连接。**每次请求都是独立的**，服务器无法判断本次请求和上一次请求是否来自同一个用户，无法判断用户的登录状态。

为了解决HTTP协议无状态的问题，产生了Cookie。

> Cookie是服务器端发送给客户端的一段特殊信息，这些信息以文本的方式存放在客户端，客户端每次向服务器发送请求时都会带上这些信息。

有了Cookie后，服务器就能够获取到客户端的信息，如果需要对信息进行验证，还需要用到Session。

> 客户端请求服务器，服务器会为这次请求开辟一块内存空间，存储Session对象。

### 实现流程

用户首次登录时：

1. 用户访问某网站的`http://www.xxx.com/login`时，输入密码登录
2. 服务器验证通过后，会创建SessionId，并将它保存起来
   - 可能存在很多地方，如：内存、文件、数据库等。

3. 服务器响应HTTP请求，并通过`Set-Cookie`，将SessionId写入到Cookie中

第一次登录完成之后，后续的访问就可以直接使用Cookie进行身份验证了：

1. 用户访问`http://www.xxx.com/pageB`时，会自动带上第一次登录时写入的Cookie

2. 服务器必读Cookie中的SeesionId和保存在服务器的SessionId是否一致

3. 如果一致，则身份验证通过

### 存在的问题

- 服务器需要对接大量的客户端时，就需要存放大量的SessionId，这样会导致服务器压力过大。
- 如果服务器是一个集群，为了同步登录状态，需要将SessionId同步到每一台机器上，增加了服务器维护成本。
- 由于SessionId存放在Cookie中，无法避免CSRF(Cross-sit request forgery跨站请求伪造)攻击。

## Token登录

Token是服务器生成的一串字符，以作为客户端请求的一个令牌。当第一次登录后，服务器会生成一个Token，并返回给客户端，客户端后续访问时，只需要带上这个Token即可完成身份验证。

### 实现流程

用户首次登录时：

1. 输入账号密码，登录

2. 服务器验证账号密码通过后，创建token

3. 服务器将token返回给客户端，由**客户端保存**

后续页面访问时：

- 带上第一次登录时获取的token
- 服务器验证token

### token的特点

- 服务器不需要存放token
- token可以存放在前端任何地方，可以不用保存在Cookie中
- token下发之后，只要在生效时间内，就一直有效，服务器想回收token权限并不容易

### token生成方式

最常见的token生成方式是使用JWT(Json Web Token)。

服务器不存放token，那如何判断token的有效性呢？

JWT主要有3个部分组成：

- header(头信息)，制定了JWT使用的签名算法
- playload(消息体)，包含账号密码信息
- signature(签名)，保证JWT不能被随意篡改。

## SSO单点登录

单点登录(Single Sign On)时在公司内部搭建一个公共的认证中心，公司下的所有产品的登录都可以在认证中心完成，一个产品在认证中心登录后，再去访问其他产品时，可以不用登录，直接获取登录状态。

### 实现流程

用户首次访问时，需要在认证中心登录：

1. 用户首次访问产品A的网站时
2. 重定向到认证中心，并带上redirect信息，以便在登录后直接进入对应页面
3. 用户在认证中心输入账号密码
4. 认证中心验证有效性，然后重定向到redirect包含的页面，并带上授权码ticket，同时将认证中心`sso.com`的登录状态写入Cookie
5. 在产品A的服务器中，拿着ticket向认证中心确认授权码的有效性
6. 验证成功后，服务器将登录信息写入Cookie(此时客户端有2个Cookie，分别存储网站A、认证中心的登录状态)

访问其他产品的网站B时：

由于认证中心存储了Cookie，所以不用再次输入账号密码，直接返回第4步，发送ticket给网站B。

### 单点登录退出

在一个产品网站上退出了登录，如何在其他的产品网站也退出登录？

在单点登录的第5步，每一个产品在向认证中心验证ticket时，可以顺带将自己的退出API发送到认证中心。

当产品A网站退出登录时：

1. 清空网站A的登录Cookie
2. 请求认证中心`sso.com`中的退出API
3. 认证中心遍历下发过ticket的所有产品，并调用对应的退出API，完成所有的退出。

## OAuth第三方登录

### 微信开放平台的接入流程

1. 网站A的运营者需要在微信开放平台注册账号，并向微信申请使用微信登录功能
2. 申请成功后，得到appid、appsecret
3. 用户在网站A使用微信登录
4. 跳转到微信的OAuth授权登录，并带上redirect信息
5. 用户登录微信成功后，可以选择授权范围：如头像、昵称等
6. 授权之后，微信会根据redirect信息，并带上一个临时票据code
7. 网站A获取code后，会拿着code、appid、appsecret，向微信服务器申请token，申请成功后，微信会下发一个token
8. 网站A有了token后，就可以凭借token获取微信的用户邮箱、昵称等
9. 网站A提示用户登录成功，并将登录状态写入Cookie，以作为后续访问的凭证

### github第三方登录

流程和微信差不多

[申请授权](https://github.com/settings/applications/new)：主要配置下**Authorization callback URL**

[参考文档](https://docs.github.com/en/developers/apps/creating-an-oauth-app)

```js
// index.js
const Koa = require('koa')
const router = require('koa-router')()
const static = require('koa-static')
const app = new Koa()
const axios = require('axios')
const querystring = require('querystring')

app.use(static(__dirname + '/'))

const config = {
  client_id: '23ec042bbc8b5ae2b47a',
  client_secret: '84c55c84e7c6f214d9f55215c17efb15185965b2'
}
const authorize_url = 'https://github.com/login/oauth/authorize'

router.get('/github/login', async ctx => {
  let path = `${authorize_url}?client_id=${config.client_id}`
  ctx.redirect(path)
})

router.get('/auth/github/callback', async ctx => {
  console.log('callback...')
  const { code } = ctx.query
  console.log('code: ', code)
  // 获取access_token
  const params = {
    client_id: config.client_id,
    client_secret: config.client_secret,
    code: code
  }
  let ret = await axios.post('https://github.com/login/oauth/access_token', params)
  const { access_token } = querystring.parse(ret.data)
  console.log('access_token', access_token)
  // 使用access_token，获取用户信息
  // ret = await axios.get(`https://api.github.com/user?access_token=${access_token}`)
  // 也可以在headers里传递token信息
  ret = await axios({
    method: 'get',
    url: 'https://api.github.com/user',
    headers: {
      Authorization: `token ${access_token}`
    }
  })
  console.log('user: ', ret.data)
  
  ctx.body = `
    <h1>Hello ${ret.data.login}</h1>
    <img src="${ret.data.avatar_url}" />
  `
  // 也可以携带参数，重定向到其他页面
  // ctx.redirect(`/home.html?name=${ret.data.login}`)
})

app.use(router.routes())
app.listen(7000)
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <a href="/github/login">使用github登录</a>
</body>
</html>
```

1. 运行：`node index.js`

2. 访问：`localhost:7000`，点击登录

