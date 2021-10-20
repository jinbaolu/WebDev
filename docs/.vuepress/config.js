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
      { text: "Vue2", link: "/vue/" },
      { text: "配置记录", link: "/config/" },
      { text: "知识点", link: "/knowledge/" },
      {
        text: "链接分享",
        items: [
          {
            text: "面试",
            items: [
              {
                text: "前端试题库",
                link: "https://www.html5iq.com/index.html",
              },
              { text: "空缺", link: "/language/japanese" },
            ],
          },
          {
            text: "工具",
            items: [
              { text: "空缺", link: "/language/chinese" },
              { text: "空缺", link: "/language/japanese" },
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
};
