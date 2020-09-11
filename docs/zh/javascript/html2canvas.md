# html2canvas

## 保存为图片

[html2canvas文档](http://html2canvas.hertzen.com/documentation)

[html2cavans.js](https://github.com/niklasvh/html2canvas/releases)或者[使用cdn](https://unpkg.com/html2canvas@1.0.0-rc.7/dist/html2canvas.js)

```html
<div id="container">
    <p>开始</p>
    <p>结束</p>
</div>
<button id="saveAsPng">保存为图片</button>
```

```js
let container = document.getElementById('container')
const pngBtn = document.getElementById('saveAsPng')
// 保存图片
pngBtn.addEventListener('click', function () {
    const filename = new Date().getTime() + '.png';
    html2canvas(container, {
        scrollX: 0,
        scrollY: 0
    }).then(async canvas => {
        var type = 'png';
        var imgData = canvas.toDataURL(type);
        saveDom2Png(imgData, filename); // 使用新建的a标签下载图片
    })
})
function saveDom2Png(data, filename) {
    const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    saveLink.href = data;
    saveLink.download = filename;
    const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
    })
    saveLink.dispatchEvent(event)
}
```

## dom中有外链图片

**实现思路**：把外链图片的url改为base64。

使用express搭建一个服务器，并保存一个logo图片：

```js
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public', {
  setHeaders: (res, path, stat) => {
    res.set('Access-Control-Allow-Origin', '*') // 设置跨域
  }
}))

app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(port, () => {
  console.log(`server is running at http://localhost:3000`)
})
```

- 静态资源存放路径：/public/images/logo.png
- 必须设置跨域

```html
<div id="container">
    <p>开始</p>
    <img src="http://localhost:3000/images/logo.png" alt="图片150">
    <p>结束</p>
</div>
<button id="saveAsPng">保存为图片</button>
```

```js
let container = document.getElementById('container')
const pngBtn = document.getElementById('saveAsPng')
// 把container里所有图片的url转换成base64
formatDomUrl(container) // 格式化dom，把dom里的url改成base64
// 省略...和上面的代码一样

async function formatDomUrl(dom) {
    const imgs = dom.getElementsByTagName('img') // dom是引用对象，所以直接修改了container
    const imgDataUrl = []
    for (let i = 0; i < imgs.length; i++) {
        const dataUrl = await imgUrl2Base64(imgs[i].src)
        imgDataUrl.push(dataUrl)
    }
    for (let i = 0; i < imgDataUrl.length; i++) {
        imgs[i].src = imgDataUrl[i]
    }
}
function imgUrl2Base64(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('get', url, true)
        xhr.send()
        xhr.responseType = 'blob'

        xhr.onload = function() {
            if (this.status === 200) {
                const blob = this.response
                const fileReader = new FileReader()
                fileReader.onloadend = function(e) {
                    const result = e.target.result
                    resolve(result)
                }
                fileReader.readAsDataURL(blob)
            }
        }
        xhr.onerror = function() {
            reject()
        }
    })
}
```

## 导出为pdf

有可能html的高度比较高，此时可以考虑导出为pdf进行分页显示。

[jspdf](https://github.com/MrRio/jsPDF)

[参考](https://segmentfault.com/a/1190000009211079)

```html

<div id="container">
    <p style="height: 3000px">开始</p>
    <p>内容很多。。。</p>
    <img src="http://localhost:3000/images/logo.png" alt="图片150">
    <p>结束</p>
</div>
```

```js
// <script src="https://unpkg.com/jspdf@2.1.1/dist/jspdf.umd.min.js"></script>
const { jsPDF } = window.jspdf // 注意引入的版本是dist发布版本，不是import导入的版本
pngBtn.addEventListener('click', function () {
    const filename = new Date().getTime() + '.png';
    html2canvas(container, {
        scrollX: 0,
        scrollY: -window.scrollY // 为了保证滚动页面后正常截取
    }).then(async canvas => {
        var contentWidth = canvas.width
        var contentHeight = canvas.height
        var a4Width = 594.3
        var a4Height = 840.51
        var pageHeight = contentWidth / a4Width * a4Height
        var restHeight = contentHeight
        var offset = 0
        var padding = 20

        var imgWidth = a4Width - padding
        var imgHeight = (a4Width - padding) / contentWidth * contentHeight

        var pageData = canvas.toDataURL('image/png', 1.0)
        // eslint-disable-next-line new-cap
        var doc = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4'
        })
        if (restHeight < pageHeight) {
            doc.addImage(pageData, 'PNG', padding, 0, imgWidth, imgHeight)
        } else {
            while (restHeight > 0) {
                doc.addImage(pageData, 'PNG', padding, offset, imgWidth, imgHeight)
                restHeight -= pageHeight // 减去一页的高度
                offset -= 840.51
                if (restHeight > 0) {
                    doc.addPage()
                }
            }
        }
        doc.save(`${filename}.pdf`)
    })
})
```



