# 移动端 rem 布局

## 原理

简单说通过 root font-size 大小作为桥梁，并且监听 resize 事件，根据窗口大小去修改 root font-size，那么使用 rem 作为单位的元素会同步变化。

## rem.js

```javascript
const baseSize = 16
function setRem() {
  let scale = document.documentElement.clientWidth / 360
  document.documentElement.style.fontSize = baseSize * scale + "px"
}
setRem()
window.onresize = function() {
  setRem()
}
```

360 可以看作设计稿宽度  
baseSize 基准大小为 1rem 时的 px 大小

## 引入

```javascript
//引入rem布局
import "@/scripts/utils/rem"
```

此时页面上以 rem 为单位的变量都能根据页面宽度变化而自适应

## 转换

上述操作是把 css 代码中的有关 rem 单位的长度变成自适应，但问题我们按 UI 图开发都是填 px 长度

vue.config.js 中配置插件

```javascript
// 引入等比适配插件
const px2rem = require("postcss-px2rem")

// 配置基本大小
const postcss = px2rem({
  // 基准大小 baseSize，需要和rem.js中相同
  remUnit: 16,
})

// 使用等比适配插件
module.exports = {
  lintOnSave: true,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [postcss],
      },
    },
  },
}
```
