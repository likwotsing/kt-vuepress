module.exports = {
  title: 'kt-vuepress',
  description: 'Just playing around',
  base: '/kt-vuepress/',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: '前端知识',
      description: '前端知识点汇总'
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
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
    repoLabel: '查看源码',
    docsDir: 'docs',
    logo: '/assets/img/logo.png',
    sidebar: 'auto',
    smoothScroll: true,
    editLinks: true,
    searchMaxSuggestions: 10,
    // algolia: {
    //   // apiKey: '3a539aab83105f01761a137c61004d85',
    //   apiKey: '3fcf09b732e823c9799ba79c076dd039',
    //   indexName: 'kt-vuepress'
    // },
    locales: {
      '/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在Github 上编辑此页',
        lastUpdated: '上次更新',
        nav: require('./nav/zh'),
        sidebar: {
          '/zh/relation/': getRelationSidebar('更多', '介绍'),
          '/zh/javascript/': getJavaScriptSidebar('JavaScript'),
          '/zh/wx/': getWxSidebar(),
          '/zh/interest/': getInterestBar(),
          '/zh/node/': getNodeBar('Node', '介绍'),
          '/zh/explore/': getExploreBar('探索', '说明'),
          '/zh/server/': getServerBar('Server', '介绍')
        }
      }
    }
  }
}

function getRelationSidebar(groupA, introductionA) {
  return [
    {
      title: groupA,
      collapsable: false,
      sidebarDepth: 2,
      children: [
        ['', introductionA],
        'webpack',
        'package.json'
      ]
    }
  ]
}

function getJavaScriptSidebar(groupA) {
  return [
    {
      title: groupA,
      collapsable: false,
      sidebarDepth: 3,
      children: [
        'event-delegation',
        'closure',
        'event-loop',
        'html2canvas'
      ]
    }
  ]
}

function getWxSidebar() {
  return [
    'gzh',
    'xcx'
  ]
}

function getInterestBar() {
  return [
    'id'
  ]
}

function getNodeBar(groupA, introductionA) {
  return [
    {
      title: groupA,
      collapsable: false,
      sidebarDepth: 3,
      children: [
        ['', introductionA],
        'node',
        'node-tool',
        'http',
        'crawler',
        'typescript',
        'login',
        'express'
      ]
    }
  ]
}

function getExploreBar(groupA, introductionA) {
  return [
    {
      title: groupA,
      collapsable: false,
      sidebarDepth: 3,
      children: [
        ['', introductionA],
        'flutter'
      ]
    }
  ]
}


function getServerBar(groupA, introductionA) {
  return [
    {
      title: groupA,
      collapsable: false,
      sidebarDepth: 3,
      children: [
        ['', introductionA],
        'git',
        'linux'
      ]
    }
  ]
}