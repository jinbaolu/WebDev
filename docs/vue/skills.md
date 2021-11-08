---
title 实用技巧
---

# 实用技巧

## v-bind、v-on

在进行组件数据、事件绑定的时候，v-bind、v-on 支持直接传递对象或表达式，如下

```vue
<template>
<child v-bind="attrs" v-on="events ? {click: () => {}} : ''">
</template>

<script>
	export default = {
        data() {
            return {
                attrs: {
                    name: '小花',
                    age: '18.8',
                },
                events: true,
            }
        }
    }
</script>
```

::: tip
在封装通用组件跟 mixins 搭配起来使用，可根据不同页面需求实现动态注册 props、event；
:::

## Object.freeze

​ 针对某些需要初次渲染后就不再响应式变化的变量，vue2 没有像 vue3 那样特别定义出 Api，在 vue2 中可以在赋值的时候使用 Object.freeze 来阻止 vue 写入追踪响应式变化(会有那么点性能提升)

```vue
<template>
  <div v-for="item in name" :key="item">{{ "姓名：" + item }}</div>
</template>

<script>
export default = {
       data() {
           return {
               name: Object.freeze(['小明', '小红', '小刚'])
           }
       }
   }
</script>
```

## .sync 修饰符

​ 受限于`单向数据流`，vue 的父子组件传参是通过 props 和\$emit 来实现，很多时候，父子组件实现 props 的双向绑定是使用官网建议的自定义组件的 v-model，另外的，官网也介绍了.sync 修饰符的使用，父组件传递 props 的时候加上.sync 修饰符，子组件需要更新 props 时，使用`$emit('update:props', payload)`的形式来变更，父组件那边就可以省略一个自定义事件监听(实际上.sync 修饰符、自定义组件中使用 v-model 的实现，还是在借助 props 和\$emit，只是一种语法糖，并未破坏 vue 的单向数据流)；

## props 校验

​ 父子传参的 props 校验(底层由 flow-bin 实现，vue3 使用 ts 实现)是很有必要的(推荐项目中的 eslintrc 继承 eslint-plugin-vue 的"plugin:vue/recommended")，props 校验支持定义 type、default、required、validator；
:::tip

- type：除了支持常见数据格式，还支持 Promise 和 Symbol；
- default：对象或数组的默认值必须从一个工厂函数返回；
- validator：校验函数，返回值为 falsy 则报错；
  :::

# HookEvent

​ 定时器、DOM 事件监听、自定义事件监听之类消耗资源的行为应该在组件或页面切换的时候及时销毁，Vue 官网针对这类情况，提出了`程序化的事件侦听器`，就是使用\$once 搭配 hook 的写法来实现资源销毁的简写，下面引用一下官网例子；

```js
// 一次性将这个日期选择器附加到一个输入框上
// 它会被挂载到 DOM 上。
mounted: function () {
  // Pikaday 是一个第三方日期选择器的库
  this.picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })
},
// 在组件被销毁之前，
// 也销毁这个日期选择器。
beforeDestroy: function () {
  this.picker.destroy()
}
```

上例使用了中间变量 picker 来存放日期选择器实例，只是为了在组件销毁期可以对它进行销毁，实际上，只需要使用 hook，就可以免去这样麻烦的操作；

```js
mounted: function () {
  var picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })

  this.$once('hook:beforeDestroy', function () {
    picker.destroy()
  })
}
```

除了上述的情况使用到 hook 之外，另外的用法是父组件内监听子组件的生命周期，常用于监听 mounted、updated、beforeDestroy 之类的生命周期钩子来拓展某些功能(加 loading 效果、重新绑定事件或者销毁某些资源之类的操作)，这种用法听起来很像 transition 组件的事件钩子(elementUI 的 dialog 组件就是用 transition 组件的事件钩子来实现 open、opened、close 事件回调)，也算是我们封装组件可供选择的另一种监听方案；

```vue
<template>
	<div id="app">
        <child @hook:updated="viewsChange">
    </div>
</template>

<script>
	export default = {
        methods: {
            viewsChange() {
                // 子组件视图变化了，重新绑定事件或者做某些操作
            }
        }
    }
</script>
```

## $attrs、$listeners

官网中介绍到这两个 API 在封装高级别的组件时非常有用，就是二次封装第三方组件的时候使用上这两个 API，搭配`inheritAttrs: false`，将组件父作用域中的事件监听和非 props 的属性透传给下级组件，
​ 如封装 elementUI 的头像组件，该组件支持 hover 出现下拉菜单，代码如下：

```vue
<template>
  <!-- 用法：<Avatar :size="60" src="htttip://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" /> -->
  <el-dropdown>
    <el-avatar v-bind="$attrs" v-on="$listeners"></el-avatar>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>个人中心</el-dropdown-item>
      <el-dropdown-item>退出登录</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'Avartar'
  inheritAttrs: false
}
</script>
```

:::tip
组件的内的$attrs是指父作用域中不作为 prop 被识别 (且获取) 的 attribute 绑定(排除class、style)，与之相对的是$props
:::

## \$options

\$options 当前组件的初始选项，获取组件的初始值(读取组件初始信息)，常用来处理“数据重置”，如表单的"重置"功能；

```js
Object.assign(this.$data, this.$options.data());
```

## \$watch

`$watch`允许动态添加数据侦听，它返回一个 unwatch 函数，取消侦听的时候调用一下即可，常用于一次性侦听(只侦听一次或特定值变化时取消侦听.

```js
// 监听游戏是否胜利，胜利则结束游戏，并祝贺玩家，取消监听
created() {
    const unWatch = this.$watch('win', (cur, old) => {
      this.gameOver = true
      console.log('Congratulration!')
      unWatch()
    })
},
```

## \$event

​`$event`，自定义事件的事件对象(\$emit 提交的参数)或原生事件对象，支持在 template 中显式书写出来，如：

```vue
<template>
  <div>
    <child @click="handle('子组件1', $event)" />
    <child @click="handle('子组件2', $event)" />
  </div>
</template>
<script>
export default = {
       methods: {
           handle(name, ev) {
               console.log(`这是${name}接受到的自定义事件参数${ev}`)
           }
       }
   }
</script>
```

:::tip
在组件中$emit的参数就是父作用域中自定义事件回调的$event，如果自定义事件回调只有$event一个参数的话，可以将@click="handleClick($event)"简写为@click="handleClick"，$event以回调函数第一参数的形式隐式传递下去；子组件$emit 多参数时，不适合使用\$event 占位，建议使用箭头函数传递自定义参数参数，如@click="(val, val1) => handleClick(val, val1, 自定义参数)"；
:::

## 事件总线 EventBus

跨级组件通讯或未知层级组件通讯可以使用 EventBus，其原理是 Vue 的`$on`、`$emit`这两个 API 实现单实例内自定义事件的`监听`和`触发`；使用方法是实例化一个空的 Vue 实例，然后在需求组件中调用这个实例上的$on来监听自定义事件或调用$emit 来触发自定义事件并传参，如：

```js
// main.js
Vue.prototype.$eventBus = = new Vue()

// component A
created() {
	this.$eventBus.$on('sayName', (name) => console.log(name))
    this.$once('hook:beforeDestroy', () => {
		this.$eventBus.$off('sayName')
	})
}

// component B
<button @click="$eventBus.$emit('sayName', 'Jane')">my name is hanMeiMei</button>
```

## :key

业务中总免不了要强制刷新组件，记得在使用 element-ui 的 dialog 组件嵌套表单组件的时候，重新打开 dialog 组件，其内的表单组件并没有被重置，每次打开 dialog 组件，表单组件都保存着上一次的状态，研究发现，这个 dialog 组件的显示/隐藏就是 v-show 一样的操作 css 属性来实现，实际上相关的组件并没有被重新渲染；

要解决刚提到的组件不刷新(重新渲染)问题，这时候，key 的存在就十分的合理了，key 是`虚拟DOM`节点的唯一标识，`diff`算法也会对其进行判断，从而决定是否复用这个节点，组件不刷新，那我们就告诉 diff 算法这个组件不是从前的组件了(key 不同了)，别复用这个组件节点，重新渲染组件；

## 组件实例 API

​ Vue 提供`$root`、`$parent`、`$children`、`$refs`这几种特殊 API 来获取指定组件的实例，某些场景下拿到 Vue 的组件实例是十分有用的，如调用组件实例的 methods、修改$data的值，又或者是获取到组件的$el 等操作，实际上这类的操作也就相当于组件通讯了，获取到组件实例之后，在调用其 methods 时，完全可以传递参数给该组件方法

:::tip
root 和 parent 都能够实现访问父组件的属性和方法，两者的区别在于，如果存在多级子组件，通过 parent 访问得到的是它最近一级的父组件，通过 root 访问得到的是根父组件
:::

## Vue.extend

`Vue.extend`这个 API 支持组件实例，最常用的场景是实现动态挂载(未知组件挂载位置)，或借助 `extend` 继承甚至于扩展组件能力(如 elementUI 的 message、msgBox 之类的)，官方文档说到 extend 类似于 mixins，实际上比 mixins 强大很多，mixins 是没办法做到 `<template>`模板的复用和拓展，而 extend 可以；

```vue
<!-- suffixMsg.vue -->
<template>
  <span>{{ text }}</span>
</template>

<script>
export default {
  name: "suffixMsg",
  data() {
    return {
      text: "",
    };
  },
};
</script>
```

```vue
<!-- 点击具体按钮，在按钮后面追加提示信息，若原有追加信息则先删除再追加 -->
<template>
  <div v-for="i in 3" :key="i" :ref="'btn' + i">
    <button @click="appendMsg(i)">按钮{{ i }}</button>
  </div>
</template>

<script>
import Vue from "vue";
import suffixMsg from "@/views/home/suffixMsg";
export default {
  data() {
    return {
      instance: null,
      nodeRecord: null,
    };
  },
  methods: {
    appendMsg(i) {
      // 原有追加信息，删除追加信息
      if (this.instance && this.nodeRecord) {
        this.instance.$destroy();
        this.$refs[this.nodeRecord][0].removeChild(this.instance.$el);
      }
      // 扩展组件并挂载DOM
      const SuffixMsg = Vue.extend(suffixMsg);
      this.instance = new SuffixMsg({
        data: { text: "这里是按钮" + i },
      });
      this.instance.$mount();
      this.nodeRecord = "btn" + i;
      this.$refs[this.nodeRecord][0].appendChild(this.instance.$el);
    },
  },
};
</script>
```
