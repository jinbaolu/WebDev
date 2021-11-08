# 原型和闭包

## 前言

关键字：函数、对象、原型、继承、执行上下文、作用域、自由变量、闭包  
笔记来源于王福朋- <a href="https://www.cnblogs.com/wangfupeng1988/p/3977924.html">深入理解 javascript 原型和闭包</a>  
本文基于王文章的基础上给予补充和理解

## 一切皆对象

一切（引用类型）都是对象，对象是属性的集合。  
方法也是一种属性。因为它的属性表示为键值对的形式。

## 值类型和引用类型

```javascript
function show(x) {
  console.log(typeof x); // undefined
  console.log(typeof 10); // number
  console.log(typeof "abc"); // string
  console.log(typeof true); // boolean

  console.log(typeof function() {}); //function

  console.log(typeof [1, "a", true]); //object
  console.log(typeof { a: 10, b: 20 }); //object
  console.log(typeof null); //object
  console.log(typeof new Number(10)); //object
}
show();
```

以上代码列出了`typeof`输出的集中类型标识，其中上面的四种（undefined, number, string, boolean）属于简单的`值类型`，不是对象。剩下的几种情况——函数、数组、对象、null、new Number(10)都是对象。他们都是`引用类型`。

## 值类型

值类型不是对象，无法拥有自己的属性，但因为的包装类的存在，原始值就好似可以拥有自己的属性了，但其拥有的属性又有点特殊之处.

```javascript
//  str是string类型的，非对象，不能拥有属性，为什么能打印出str.length?
var str = "abcd";
console.log(str.length); //4
```

```javascript
// 因为每次执行完一条完整js语句后该类型对象的包装类就会将该语句包装，
// 所以也就不会导致报错了，这些都是后台自己写的
var str = "abcd";
//  var str1 = new String('abcd');
console.log(str.length); //4
//  var str1 = new String('abcd');
// console.log(str1.length);
```

## 对象都是通过函数创建的

平常字面量创建只是语法糖

```javascript
//var obj = { a: 10, b: 20 };
//var arr = [5, 'x', true];

var obj = new Object();
obj.a = 10;
obj.b = 20;

var arr = new Array();
arr[0] = 5;
arr[1] = "x";
arr[2] = true;
```

## prototype

每个函数都有一个属性叫做 prototype,这个 prototype 的属性值是一个对象，默认的只有一个叫做 constructor 的属性，指向这个函数本身。

```javascript
function Fn() {}
Fn.prototype.name = "王福朋";
Fn.prototype.getYear = function() {
  return 1988;
};

var fn = new Fn();
console.log(fn.name);
console.log(fn.getYear());
```

Fn 是一个函数，fn 对象是从 Fn 函数 new 出来的，这样 fn 对象就可以调用 Fn.prototype 中的属性。
因为每个对象都有一个隐藏的属性——“\_\_proto\_\_”，这个属性引用了创建这个对象的函数的 prototype。即：fn.\_\_proto\_\_ === Fn.prototype
这里的"\_\_proto\_\_"成为“`隐式原型`”  
原型链可以参考另外文章<a href="/knowledge/sourcelink">原型链和继承</a>

## 上下文环境

JavaScript 是一种`解释型`语言或者说`即时编译语言`，即解析一行执行一行，其中存在一个预解析阶段，这个阶段所执行的操作就被称为`执行上下文`或`上下文环境`。

执行上下文包括：

- 变量、函数表达式——变量声明，默认赋值为 undefined；
- this——赋值；
- 函数声明——赋值；

其中，执行的场景主要包括`全局代码`，`函数体`，`eval代码`（这里不展开）。也就是说这个上下文环境是可以嵌套，随调随生成，用完即弃。

1. 全局代码的上下文包括  
   普通变量、函数表达式的声明，赋值为 undefined  
   函数的声明  
   this 赋值，全局浏览器环境赋值为 windows

2. 函数场景
   参数 赋值  
   arguments 赋值  
   自由变量的取值作用域 赋值

总的来说，就是在执行代码之前，把将要用到的所有的变量都事先拿出来，有的直接赋值了，有的先用 undefined 占个空。

### this 指向

上下文环境中比较重要的一点就是 this 的指向，这里分情况考虑：

1. 构造函数中的 this
   > 当构造函数被直接调用时，this 指向全局 Windows  
   > 当构造函数被实例 new 出来，此时 this 指向实例出来的对象

:::tip
理解：构造函数其实也是函数，是直接挂在在 Windows 上，当直接被调用时其实也就是 Windows 调用，this 指向 windows 也不奇怪  
当使用 new 关键字时，实质是开辟一块新的的内存空间，手动将该空间的 this 指向外部

:::

2. 函数作为对象的一个属性

   > 如果函数作为对象的一个属性时，并且作为对象的一个属性被调用时，函数中的 this 指向该对象  
   > 如果 fn 函数被赋值到了另一个变量中,this 指向 Windows

:::tip
理由同上，值得注意 ⚠️ 的是，在函数内部定义函数其 this 指向与外部函数一致。
:::

3. call call、apply、bind  
   当一个函数被上述调用时，this 的值就取传入的对象的值

## 执行上下文栈

执行全局代码时，会产生一个执行上下文环境，每次调用函数都又会产生执行上下文环境。当函数调用完成时，这个上下文环境以及其中的数据都会被消除，再重新回到全局上下文环境。处于活动状态的执行上下文环境只有一个。  
其实这是一个压栈出栈的过程——执行上下文栈.

<img src="../.vuepress/public/img/shangxiewen.png" alt="上下文栈"  align="center" ></img>

## 作用域与上下文

例子展现更简单

<img src="../.vuepress/public/img/zuoyongyu1.png" alt="作用域"  align="center" ></img>

> 每个函数内部开辟不同作用域

<img src="../.vuepress/public/img/zuoyongyu2.png" alt="作用域"  align="center" ></img>

> 作用域结合上下文环境

<img src="../.vuepress/public/img/zuoyongyu3.png" alt="作用域"  align="center" ></img>

> 作用域结合上下文环境

<img src="../.vuepress/public/img/zuoyongyu4.png" alt="作用域"  align="center" ></img>

> 全过程

:::tip
连接起来看，还是挺有意思的。作用域只是一个“地盘”，一个抽象的概念，其中没有变量。要通过作用域对应的执行上下文环境来获取变量的值。同一个作用域下，不同的调用会产生不同的执行上下文环境，继而产生不同的变量的值。所以，作用域中变量的值是在执行过程中产生的确定的，而作用域却是在函数创建时就确定了。  
所以，如果要查找一个作用域下某个变量的值，就需要找到这个作用域对应的执行上下文环境，再在其中寻找变量的值。
:::

## 作用域与自由变量

<img src="../.vuepress/public/img/zuoyongyu5.png" alt="作用域"  align="center" ></img>

> 理解获取某个变量的值其实是一层一层寻找，必要时是回到定义函数的作用域去寻找

## 闭包

闭包分为两种情况

1. 函数作为返回值

   <img src="../.vuepress/public/img/bibao1.png" alt="作用域"  align="center" ></img>

2. 函数作为参数传递

   <img src="../.vuepress/public/img/bibao2.png" alt="作用域"  align="center" ></img>

上述只是形式，更核心的还是函数内部引用了外部作用域变量，而导致外部作用域及上下文环境在出栈的时候仍未被销毁。

## 总结

本编完结，其中更多直接饮用王福朋博客例图。
