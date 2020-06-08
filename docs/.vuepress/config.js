module.exports = {
  title: 'kt-vuepress',
  description: 'Just playing around',
  base: '/kt-vuepress/',
  plugins: ['@vuepress/back-to-top', '@vuepress/nprogress', '@vuepress/active-header-links', [
    '@vuepress/last-updated',
    {
      transformer: (timestamp, lang) => {
        // 不要忘了安装 moment
        const moment = require('moment')
        moment.locale(lang)
        return moment(timestamp).fromNow()
      }
    }
  ]],
  themeConfig: {
    repo: 'likwotsing/kt-vuepress',
    docsDir: 'docs',
    eidtLinks: true,
    logo: '/assets/img/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Git', link: '/zh/git/' },
      { text: 'External', link: 'https://baidu.com' },
      { text: '参考', link: 'https://github.com/likwotsing/my-vuepress' }
    ],
    sidebar: 'auto',
    lastUpdated: 'Last Updated', // string | boolean
    smoothScroll: true
  }
}