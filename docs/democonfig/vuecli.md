# vue-cli 配置

## publicPath

部署应用包时的基本 URL。
:::tip
这个值也可以被设置为空字符串 ('') 或是相对路径 ('./')，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径。
:::

## outputDir

默认输出目录'dist'
:::tip
注意目标目录在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为)
:::

## assetsDir

放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录，默认''

## indexPath

指定生成静态文件目录文件名，默认'index.html'

## filenameHashing

生成静态文件含 hash 值控制缓存，默认 true

## pages

默认”undefined“,  
在 multi-page 模式下构建应用。每个“page”应该有一个对应的 JavaScript 入口文件。其值应该是一个对象，对象的 key 是入口的名字，value 是：

- 一个指定了 entry, template, filename, title 和 chunks 的对象 (除了 entry 之外都是可选的)；
- 一个指定其 entry 的字符串。

```javascript
module.exports = {
  pages: {
    index: {
      // page 的入口
      entry: "src/index/main.js",
      // 模板来源
      template: "public/index.html",
      // 在 dist/index.html 的输出
      filename: "index.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: "Index Page",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
    // 当使用只有入口的字符串格式时，
    // 模板会被推导为 `public/subpage.html`
    // 并且如果找不到的话，就回退到 `public/index.html`。
    // 输出文件名会被推导为 `subpage.html`。
    subpage: "src/subpage/main.js",
  },
};
```

## lintOnSave

是否每次保存时都 lint 代码：

- `default`：默认值，强制 eslint-loader 将 lint 错误输出为编译错误，同时也意味着 lint 错误将会导致编译失败。
- `true` 或 `warning`:eslint-loader 会将 lint 错误输出为编译警告。默认情况下，警告仅仅会被输出到命令行，且不会使得编译失败。
- `error`:会使得 eslint-loader 把 lint 警告也输出为编译错误，这意味着 lint 警告将会导致编译失败。

:::tip
配置浏览器同时显示错误和警告

```javascript
// vue.config.js
module.exports = {
  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
  },
};
```

:::

:::tip
生产构建时禁用 eslint-loader，你可以用如下配置

```javascript
// vue.config.js
module.exports = {
  lintOnSave: process.env.NODE_ENV !== "production",
};
```

:::

## runtimeCompiler

是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右,默认"false"。  
:::tip
建议使用 runtime-only
:::

## transpileDependencies

默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。默认"[]"

## productionSourceMap

生产模式的 SourceMap，默认"true"

## crossorigin

Default: undefined,

设置生成的 HTML 中 `<link rel="stylesheet">`和 `<script>` 标签的 `crossorigin`属性。  
跟错误返回详细信息有关。

## integrity

在生成的 HTML 中的 `<link rel="stylesheet">`和 `<script>` 标签上启用 Subresource Integrity (SRI)。如果你构建后的文件是部署在 CDN 上的，启用该选项可以提供额外的安全性。

## configureWebpack

如果这个值是一个`对象`，则会通过 `webpack-merge` 合并到最终的配置中。

如果这个值是一个`函数`，则会接收被解析的配置作为参数。该函数既可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本。

## chainWebpack

是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。

## css.requireModuleExtension

默认情况下，只有 _.module.[ext] 结尾的文件才会被视作 CSS Modules 模块。设置为 false 后你就可以去掉文件名中的 .module 并将所有的 _.(css|scss|sass|less|styl(us)?) 文件视为 CSS Modules 模块。Default: true

## css.extract

是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。Default: 生产环境下是 true，开发环境下是 false  
:::tip
当作为一个库构建时，你也可以将其设置为 false 免得用户自己导入 CSS。
:::

## css.sourceMap

是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能。 Default: false

## css.loaderOptions

向 CSS 相关的 loader 传递选项。Default: {} ,例如：

```javascript
module.exports = {
  css: {
    loaderOptions: {
      css: {
        // 这里的选项会传递给 css-loader
      },
      postcss: {
        // 这里的选项会传递给 postcss-loader
      },
    },
  },
};
```

## devServer

所有 webpack-dev-server 的选项都支持。

## devServer.proxy

如果你的前端应用和后端 API 服务器没有运行在同一个主机上，你需要在开发环境下将 API 请求代理到 API 服务器。这个问题可以通过 vue.config.js 中的 devServer.proxy 选项来配置。  
参考 webpack

## parallel

是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。  
Default: require('os').cpus().length > 1

## css 相关配置

<a href="https://cli.vuejs.org/zh/guide/css.html#%E5%90%91%E9%A2%84%E5%A4%84%E7%90%86%E5%99%A8-loader-%E4%BC%A0%E9%80%92%E9%80%89%E9%A1%B9">配置全局样式</a>

```javascript
const autoprefixer = require("autoprefixer");
const postcssPxtorem = require("postcss-pxtorem"); // @H5 将 px 转成 rem
module.exports = {
  css: {
    loaderOptions: {
      //向所有 Less 样式传入共享的全局变量
      less: {
        globalVars: {
          hack: `true; @import '~@/assets/style/var.less';`,
        },
      },
      postcss: {
        plugins: function({ resourcePath: path }) {
          //   const pxtorem = postcssPxtorem({ propList: ['*'] }) // @H5 将 px 转成 rem
          if (
            /* 跳过 autoprefixer */
            /[\\/]node_modules[\\/].+\.css$/.test(path) ||
            /[\\/]src[\\/]libs[\\/].+\.css$/.test(path) ||
            (isDev && env.DEV_CSS_AUTOPREFIXER !== "true") // 开发环境跳过添加兼容性前缀，便于调试
          ) {
            // return [pxtorem]
          }
          // return [pxtorem, autoprefixer]
          return [autoprefixer]; //pc下不需要rem,若需要注释这行，放开上3行
        },
      },
    },
    sourceMap: isDev
      ? env.DEV_CSS_SOURCEMAP === "true"
      : env.VUE_APP_ENV === "stage1", // css sourceMap设置为true可能会影响构建性能
  },
};
```
