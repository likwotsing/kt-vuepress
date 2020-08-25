# Crawler

[电影天堂](https://www.dy2018.com/)爬虫

[iconv-lite](https://www.npmjs.com/package/iconv-lite)：纯js编码转换

[cheerio](https://www.npmjs.com/package/cheerio)：Fast, flexible & lean implementation of core jQuery designed specifically for the server.

```js
// server.js
// const originRequest = require('request') // 已废弃，使用https代替
const https = require('https')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')

function request(url, cb) {
  const option = {
    encoding: null
  }
  // originRequest(url, option, cb)
  https.request(url, option, cb)
}

for (let i = 101705; i < 101710; i++) {
  const url = `https://www.dy2018.com/i/${i}.html`
  // request(url, (err, res, body) => {
  //   const html = iconv.decode(body, 'gb2312')
  //   const $ = cheerio.load(html)
  //   console.log($('.title_all h1').text())
  // })
  https.get(`https://www.dy2018.com/i/${i}.html`, res => {
    res.on('data', (d) => {
      const html = iconv.decode(d, 'gb2312') // 网页的charset是gb2312
      const $ = cheerio.load(html)
      console.log($('.title_all h1').text()) // 把电影标题打印出来
      // process.stdout.write(d);
    });
  })
}

```

运行：`node server.js`

