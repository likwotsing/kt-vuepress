# Crawler

[电影天堂](https://www.dy2018.com/)爬虫

[iconv-lite](https://www.npmjs.com/package/iconv-lite)：纯js编码转换

[cheerio](https://www.npmjs.com/package/cheerio)：Fast, flexible & lean implementation of core jQuery designed specifically for the server.

```js
// server.js
const originRequest = require('request')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')

function request(url, cb) {
  const option = {
    encoding: null
  }
  originRequest(url, option, cb)
}
for (let i = 101705; i < 101715; i++) {
  const url = `https://www.dy2018.com/i/${i}.html`
  request(url, (err, res, body) => {
    const html = iconv.decode(body, 'gb2312') // 网页的charset='gb2312'
    const $ = cheerio.load(html)
    console.log($('.title_all h1').text()) // 把标题打印出来
  })
}
```

运行：`node server.js`

