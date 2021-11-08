module.exports = {
  title: "Lujinbao",
  description: "记录笔记✏️✏️",
  base: "/", // 部署到github相关的配置
  serviceWorker: true, // 是否开启 PWA
  markdown: {
    lineNumbers: true,
  },
  head: [
    // 注入到当前页面的 HTML <head> 中的标签
    ["link", { rel: "icon", href: "/img/logo.jpg" }],
    ["link", { rel: "manifest", href: "/img/photo.jpg" }],
    ["link", { rel: "apple-touch-icon", href: "/img/logo.jpg" }],
    ["meta", { "http-quiv": "pragma", cotent: "no-cache" }],
    ["meta", { "http-quiv": "pragma", cotent: "no-cache,must-revalidate" }],
    ["meta", { "http-quiv": "expires", cotent: "0" }],
  ],
  themeConfig: {
    logo: "/img/logo.jpg",
    nav: [
      // 导航栏配置
      { text: "首页", link: "/" },
      {
        text: "Vue2",
        items: [
          { text: "实用技巧", link: "/vue/skills" },
          { text: "必知原理", link: "/vue/theory" },
        ],
      },
      {
        text: "TypeScript",
        items: [
          { text: "基本类型", link: "/ts/basetype" },
          { text: "编译选项", link: "/ts/compile" },
          { text: "打包", link: "/ts/build" },
          { text: "面向对象", link: "/ts/oop" },
          { text: "接口", link: "/ts/interface" },
          { text: "范型", link: "/ts/generic" },
        ],
      },
      {
        text: "配置参考",
        items: [
          {
            text: "vue-router",
            link: "/democonfig/vuerouter",
          },
          {
            text: "axios",
            link: "/democonfig/axios",
          },
          {
            text: "webpack",
            link: "/democonfig/webpack",
          },
          {
            text: "vue-cli4",
            link: "/democonfig/vuecli",
          },
          {
            text: "rem",
            link: "/democonfig/rem",
          },
          {
            text: "代码格式化",
            link: "/democonfig/format",
          },
        ],
      },
      {
        text: "知识点",
        items: [
          {
            text: "理论知识",
            items: [
              { text: "JavaScript", link: "/knowledge/javascript" },
              { text: "JS事件", link: "/knowledge/jsevent" },
              { text: "JS事件循环", link: "/knowledge/eventloop" },
              { text: "JS原型链和继承", link: "/knowledge/sourcelink" },
              { text: "原型和闭包", link: "/knowledge/callstackenvir" },
            ],
          },
          {
            text: "思路",
            items: [
              { text: "埋点实现", link: "/knowledge/eventloop" },
              { text: "动画指令", link: "/knowledge/eventloop" },
              { text: "敏感数据加密方案", link: "/knowledge/eventloop" },
            ],
          },
        ],
      },
      {
        text: "链接分享",
        items: [
          {
            text: "知识库",
            items: [
              {
                text: "前端试题库",
                link: "https://www.html5iq.com/index.html",
              },
              {
                text: "一只菜鸟工程师",
                link: "https://www.cnblogs.com/suihang/",
              },
              {
                text: "前端知识图谱",
                link: "https://f2e.tech/",
              },
            ],
          },
          {
            text: "工具",
            items: [
              { text: "svg转png ", link: "https://svgtopng.com/zh/" },
              { text: "阿里图标库", link: "https://www.iconfont.cn/" },
              { text: "兼容自查", link: "https://caniuse.com/" },
            ],
          },
        ],
      },
    ],
    // sidebar:{
    //   '/accumulate/': [
    //       {
    //         title: '前端积累',
    //         children: [
    //           '/accumulate/1.html',
    //           '/accumulate/2.html',
    //           '/accumulate/3.html',
    //           '/accumulate/4.html',
    //           '/accumulate/5.html',
    //           '/accumulate/6.html',
    //           '/accumulate/7.html',
    //           '/accumulate/8.html',
    //           '/accumulate/9.html',
    //           '/accumulate/10.html',
    //           '/accumulate/11.html',
    //         ]
    //       }
    //     ],
    //     '/algorithm/': [
    //       '/algorithm/',
    //       {
    //         title: '第二组侧边栏下拉框的标题1',
    //         children: [
    //           '/algorithm/'
    //         ]
    //       }
    //     ]
    // },
    sidebar: "auto", // 侧边栏配置
    sidebarDepth: 2,
    lastUpdated: "Last Updated", // string | boolean
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": "public",
      },
    },
  },
}
