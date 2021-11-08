# webpack

## webpack

本质上，webpack 是一个用于现代 JavaScript 应用程序的 静态模块打包工具。  
当使用 vue cli 生成项目时，vue 脚本默认内置 webpack，我们只需定义 vue.config.js 文件

:::tip
vue.config.js 是一个可选的配置文件，如果项目的 (和 package.json 同级的) 根目录中存在这个文件，那么它会被 @vue/cli-service 自动加载。你也可以使用 package.json 中的 vue 字段，但是注意这种写法需要你严格遵照 JSON 的格式来写。
:::

```javascript
/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  // 选项...
};
```

## 基础

entry 入口  
output 输出 出口  
loader 加载器 翻译官  
plugins 插件 打包优化压缩  
mode 模式，生产模式和开发模式

## 配置代理

代理解决跨域问题，主要是本地运行 DevServer 存在跨域，因此实质也是配置 DevServer

```javascript
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "<url>", //代理目标
        pathRewrite: { "^/api": "" }, //重写路径
        ws: true, //是否代理websockets
        changeOrigin: true, //保留主机头的来源
      },
      //多个代理
      "/foo": {
        target: "<other_url>",
      },
    },
    port: 8899, // 端口
  },
};
```

<a href="https://www.jb51.net/article/147081.htm">参考链接 🔗</a>

## 合并精灵图

webpack-spritesmith 插件

```bash
npm install webpack-spritesmith --save-dev
```

```javascript
var SpritesmithPlugin = require('webpack-spritesmith');

// 生成的雪碧图CSS文件模板自定义，也可以不配置直接使用默认的模板
var templateFunction = function (data) {

    // PC端配置
    var shared = '.ico { display: inline-block; background-image: url(I); background-size: Dpx Hpx; }'
        .replace('I', data.sprites[0].image)
        .replace('D', data.sprites[0].total_width)
        .replace('H', data.sprites[0].total_height);

    var perSprite = data.sprites.map(function (sprite) {
        return '.ico-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }'
            .replace('N', sprite.name.replace(/_/g, '-'))
            .replace('W', sprite.width)
            .replace('H', sprite.height)
            .replace('X', sprite.offset_x)
            .replace('Y', sprite.offset_y);
    }).join('\n');

    // 移动端配置
    var sharedRem = '.ico { display: inline-block; background-image: url(I); background-size: Drem Hrem; }'
        .replace('I', data.sprites[0].image)
        .replace('D', data.sprites[0].total_width / 100)
        .replace('H', data.sprites[0].total_height / 100);

    var perSpriteRem = data.sprites.map(function (sprite) {
        return '.ico-N { width: Wrem; height: Hrem; background-position: X Yrem; }'
            .replace('N', sprite.name.replace(/_/g, '-'))
            .replace('W', sprite.width / 100)
            .replace('H', sprite.height / 100)
            .replace('X', sprite.offset_x / 100)
            .replace('Y', sprite.offset_y / 100);
    }).join('\n');

    return shared + '\n' + perSprite + '\n\n' + sharedRem + '\n' + perSpriteRem;
};

...
...

    plugins: [
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(__dirname, 'src/images/icon'),            // 图标根路径
                glob: '*.png'                                               // 图标类型
            },
            target: {
                image: path.resolve(__dirname, 'dist/images/sprite.png'),   // 生成雪碧图的名称和路径
                css: [
                    [path.resolve(__dirname, 'dist/css/sprite.css'), {      // 生成CSS文件的名称和路径
                        format: 'function_based_template'                   // 模板配置，注意在customTemplates中配置对应名称的属性名
                    }],
                    [path.resolve(__dirname, 'dist/css/sprite.json'), {     // 生成json文件的名称和路径，想看图片数据的可以配置该项
                        format: 'json_texture'
                    }]
                ]
            },
            customTemplates: {
                'function_based_template': templateFunction                 // 上一项使用到的模板变量
            },
            apiOptions: {
                cssImageRef: '../images/sprite.png'                         // 生成的CSS中引用的雪碧图路径
            },
            spritesmithOptions: {
                algorithm: 'top-down',                                      // 生成的雪碧图图标排列方式
                padding: 1                                                  // 图标的间隔
            }
        }),
        new SpritesmithPlugin...                                            //如果需要生成不止一张雪碧图则继续配置
    ],

```

vue-cli 项目配置

```javascript
// vue.config.js
/* 修改的雪碧图模板样式 */
const templateFunction = function(data) {
  const shared = ".icon { display: inline-block; vertical-align: middle; background-image: url(I) }".replace(
    "I",
    data.sprites[0].image
  );
  const perSprite = data.sprites
    .map(function(sprite) {
      return ".icon-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }"
        .replace("N", sprite.name)
        .replace("W", sprite.width)
        .replace("H", sprite.height)
        .replace("X", sprite.offset_x)
        .replace("Y", sprite.offset_y);
    })
    .join("\n");
  return shared + "\n" + perSprite;
};
module.exports = () => ({
  chainWebpack: (config) => {
    /* 将小图标拼接成雪碧图 */
    config.plugin("webpack-spritesmith").use(SpritesmithPlugin, [
      {
        src: {
          cwd: "./src/assets/icon/",
          glob: "*.png",
        },
        target: {
          image: "./src/assets/icon/sprite/sprite.png",
          css: [
            [
              path.resolve(__dirname, "./src/styles/_sprite.less"),
              // 引用自己的模板
              { format: "function_based_template" },
            ],
          ],
        },
        apiOptions: {
          cssImageRef: "~@/assets/icon/sprite/sprite.png",
        },
        customTemplates: {
          function_based_template: templateFunction,
        },
        spritesmithOptions: {
          algorithm: "binary-tree",
          padding: 10,
        },
      },
    ]);
  },
});
```
