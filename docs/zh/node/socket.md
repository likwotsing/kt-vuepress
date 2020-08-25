# Socket

简易聊天室，参考：[socket.io](https://www.npmjs.com/package/socket.io#how-to-use)

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>socket</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    form {
      background-color: #000;
      padding: 3px;
      position: fixed;
      bottom: 0;
      width: 100%;
    }
    form input {
      width: 90%;
      padding: 10px;
    }
    form button {
      width: 10%;
      background-color: #409eff;
      padding: 10px;
    }
    #messages {
      list-style: none;
    }
    #messages li {
      padding: 5px 10px;
    }
    #messages li:nth-child(odd) {
      background-color: #eee;
    }
  </style>
</head>
<body>
  <ul id="messages"></ul>
  <form action="">
    <input id="ipt" type="text" /><button>Send</button>
  </form>
  <script src="https://cdn.bootcdn.net/ajax/libs/socket.io/2.3.0/socket.io.dev.js"></script>
  <script src="https://cdn.bootcdn.net/ajax/libs/jquery/2.1.1/jquery.js"></script>
  <script>
    $(function() {
      var socket = io()
      $('form').submit(function(e) {
        e.preventDefault() // 阻止表单默认行为
        socket.emit('chat message', $('#ipt').val())
        $('#ipt').val('')
        return false
      })

      // 接收别人发送的消息
      socket.on('chat message', function(msg) {
        $('#messages').append($('<li>').text(msg))
      })
    })
  </script>
</body>
</html>
```

```js
// server.js
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', client => {
  console.log('user connect...')
  // 响应用户发送的信息
  client.on('chat message', (msg) => {
    console.log('chat massage:' + msg)
    // 广播给其他人
    io.emit('chat message', msg)
  })

  client.on('disconnect', () => {
    console.log('user disconnect...')
  })
})

http.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
```

- 运行server.js，`node server.js`
- 浏览器打开`http://localhost:3000`，多开几个窗口
- 在不同窗口输入信息，观察浏览器、node控制台的输出