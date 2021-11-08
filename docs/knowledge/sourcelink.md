# 原型链和继承

## 简述

继承分为两种，`接口继承`和`实现继承`，ECMAScript 无法实现接口继承，可以实现实现继承，而 ES6 可以实现接口继承，而 ECMAScript 继承是靠原型链来实现的。

## 概念

> 每个构造函数(`constructor`)都有一个原型对象(`prototype`),原型对象都包含一个指向构造函数的指针,而实例(`instance`)都包含一个指向原型对象的内部指针.

:::tip

- let instance = new constructor
- constructor.prototype = prototype
- instance.\_\_proto\_\_ = prototype
  :::

> 如果试图引用对象(实例 instance)的某个属性,会首先在对象内部寻找该属性,直至找不到,然后才在该对象的原型(instance.prototype)里去找这个属性.

## 向上寻找

假设 访问 instance1.p1

1. 首先会在 instance1 内部属性寻找一遍；
2. 接着会在 instance1.\_\_proto\_\_就是 constructor1.prototype 中寻找
3. 如果 instance1.prototype 中还没有这个属性，就会接着往上找即 instance1.\_\_proto\_\_.\_\_proto\_\_,如此一级一级向上，直至 null
4. 找到 则返回，没找到则返回 undefined

:::tip
这种搜索的轨迹,形似一条长链, 又因 prototype 在这个游戏规则中充当链接的作用,于是我们把这种实例与原型的链条称作 `原型链`。
:::

<img src="../.vuepress/public/img/yuanxinglian.png"></img>

> 所有的原型都是由构造函数产生

> 原型对象的尽头是 null

## 确定原型和实例的关系

1. `instanceof` 操作符

> 只要用这个操作符来测试实例(instance)与原型链中出现过的构造函数,结果就会返回 true. 以下几行代码就说明了这点.

```javascript
alert(instance instanceof Object); //true
alert(instance instanceof Father); //true
alert(instance instanceof Son); //true
```

都返回 true 说明 instance 是 Object, Father 或 Son 中任何一个类型的实例。

2. `isPrototypeOf()` 方法
   > 同样只要是原型链中出现过的原型,isPrototypeOf() 方法就会返回 true

```javascript
alert(Object.prototype.isPrototypeOf(instance)); //true
alert(Father.prototype.isPrototypeOf(instance)); //true
alert(Son.prototype.isPrototypeOf(instance)); //true
```

## 经典继承

```javascript
function Father() {
  this.colors = ["red", "blue", "green"];
}
function Son() {
  Father.call(this); //继承了Father,且向父类型传递参数
}
var instance1 = new Son();
instance1.colors.push("black");
console.log(instance1.colors); //"red,blue,green,black"

var instance2 = new Son();
console.log(instance2.colors); //"red,blue,green" 可见引用类型值是独立的
```

> 缺点，无法继承父类的方法

## 组合继承

> 指的是将原型链和借用构造函数的技术组合到一块,从而发挥两者之长的一种继承模式。

```javascript
function Father(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
Father.prototype.sayName = function() {
  alert(this.name);
};
function Son(name, age) {
  Father.call(this, name); //继承实例属性，第一次调用Father()
  this.age = age;
}
Son.prototype = new Father(); //继承父类方法,第二次调用Father()
Son.prototype.sayAge = function() {
  alert(this.age);
};
var instance1 = new Son("louis", 5);
instance1.colors.push("black");
console.log(instance1.colors); //"red,blue,green,black"
instance1.sayName(); //louis
instance1.sayAge(); //5

var instance1 = new Son("zhai", 10);
console.log(instance1.colors); //"red,blue,green"
instance1.sayName(); //zhai
instance1.sayAge(); //10
```

:::tip
组合继承避免了原型链和借用构造函数的缺陷,融合了它们的优点,成为 JavaScript 中最常用的继承模式. 而且, `instanceof` 和 `isPrototypeOf()`也能用于识别基于组合继承创建的对象。
:::

## 原型继承

通过`object.create()`实现,object.create() 接收两个参数:

- 一个用作新对象原型的对象
- (可选的)一个为新对象定义额外属性的对象

```javascript
let person = {
  friends: ["Van", "Louis", "Nick"],
};
let anotherPerson = Object.create(person);
anotherPerson.friends.push("Rob");
let yetAnotherPerson = Object.create(person);
yetAnotherPerson.friends.push("Style");
alert(person.friends); //"Van,Louis,Nick,Rob,Style"
```

因为修改的是同一个引用链上的，所以即使是不同子对象同样也是修改成功的。

```javascript
var person = {
  name: "Van",
};
var anotherPerson = Object.create(person, {
  name: {
    value: "Louis",
  },
});
alert(anotherPerson.name); //"Louis"
```

第二个参数会会覆盖
:::tip
原型式继承中, 包含引用类型值的属性始终都会共享相应的值, 就像使用原型模式一样.
:::

## 寄生式继承

更像一个对象工厂，创建一个仅用于封装继承过程的函数,该函数在内部以某种方式来增强对象,最后再像真的是它做了所有工作一样返回对象。

```javascript
function createAnother(original) {
  var clone = object(original); //通过调用object函数创建一个新对象
  clone.sayHi = function() {
    //以某种方式来增强这个对象
    alert("hi");
  };
  return clone; //返回这个对象
}
```

> 使用寄生式继承来为对象添加函数, 会由于不能做到函数复用而降低效率;这一点与构造函数模式类似。

## 寄生组合式继承

组合继承是 JavaScript 最常用的继承模式; 不过, 它也有自己的不足. 组合继承最大的问题就是无论什么情况下,都会调用两次父类构造函数: 一次是在创建子类型原型的时候, 另一次是在子类型构造函数内部. 寄生组合式继承就是为了**降低调用父类构造函数的开销而出现的**

> 其背后的基本思路是: 不必为了指定子类型的原型而调用超类型的构造函数

```javascript
function extend(subClass, superClass) {
  var prototype = object(superClass.prototype); //创建对象
  prototype.constructor = subClass; //增强对象
  subClass.prototype = prototype; //指定对象
}
```

extend 函数接收子类和父类，其实就是类的构造函数，想办法让这两个类有继承关系，继承关系其实就是原型链，包括 prototype 和构造函数相互指引，所以，以父类原型生成原型对像，子类 prototype 指向原型对象，原型对象构造函数指向之类，完事。

## new 运算符

```javascript
new F(); // 实质做了以下3件事情
var obj = {};
obj.__proto__ = F.prototype;
F.call(obj);
```

:::tip
第一行，我们创建了一个空对象 obj;  
第二行，我们将这个空对象的\_\_proto\_\_成员指向了 F 函数对象 prototype 成员对象;  
第三行，我们将 F 函数对象的 this 指针替换成 obj，然后再调用 F 函数.

我们可以这么理解: 以 new 操作符调用构造函数的时候，函数内部实际上发生以下变化：

1. 创建一个空对象，并且 this 变量引用该对象，同时还继承了该函数的原型。
2. 属性和方法被加入到 this 引用的对象中。
3. 新创建的对象由 this 所引用，并且最后隐式的返回 this.
   :::

## 不能直接指定父类

```javascript
subClass.prototype = superClass.prototype; //直接指向超类型prototype
```

子类直接指定父类，那么继承函数将如下

```javascript
function extend(subClass, superClass) {
  subClass.prototype = superClass.prototype;

  subClass.superclass = superClass.prototype;
  if (superClass.prototype.constructor == Object.prototype.constructor) {
    superClass.prototype.constructor = superClass;
  }
}
```

那么, 使用 instanceof 方法判断对象是否是构造器的实例时, 将会出现紊乱。

```javascript
function a(){}
function b(){}
extend(b,a);
var c = new a(){};
console.log(c instanceof a);//true
console.log(c instanceof b);//true
```

c 被认为是 a 的实例可以理解, 也是对的; 但 c 却被认为也是 b 的实例, 这就不对了. 究其原因, instanceof 操作符比较的应该是 c.\_\_proto\_\_ 与 构造器.prototype(即 b.prototype 或 a.prototype) 这两者是否相等, 又 extend(b,a); 则 b.prototype === a.prototype, 故这才打印出上述不合理的输出.

## 完整继承例子

```javascript
function Father(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
Father.prototype.sayName = function() {
  alert(this.name);
};
function Son(name, age) {
  Father.call(this, name); //继承实例属性，第一次调用Father()
  this.age = age;
}
extend(Son, Father); //继承父类方法,此处并不会第二次调用Father()
Son.prototype.sayAge = function() {
  alert(this.age);
};
var instance1 = new Son("louis", 5);
instance1.colors.push("black");
console.log(instance1.colors); //"red,blue,green,black"
instance1.sayName(); //louis
instance1.sayAge(); //5

var instance1 = new Son("zhai", 10);
console.log(instance1.colors); //"red,blue,green"
instance1.sayName(); //zhai
instance1.sayAge(); //10
```

## es6 的继承

es6 新出`class`关键字，把 js 类的概念更贴近传统 oo 语言，但实质上，ES6 的 `class` 只是一个语法糖，它的绝大部分功能，ES5 都可以做到。

```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return "(" + this.x + ", " + this.y + ")";
  }
}
//等同于
function Point(x, y) {
  this.x = x;
  this.y = y;
}
Point.prototype.toString = function() {
  return "(" + this.x + ", " + this.y + ")";
};
```

extent 关键字完成继承

```javascript
class Point {}
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + " " + super.toString(); // 调用父类的toString()
  }
}
```

:::tip
继承需要在构造函数中使用 super 关键字调用父类构造函数，访问 this 前需要调用 super
:::

## hasOwnProperty()

判断属性是否是构造函数原型上的属性（包括方法）

## instanceof

instanceof 运算符是用来在运行时指出对象是否是构造器的一个实例。

> 判断函数是构造函数还是普通函数使用

```javascript
function f() {
  if (this instanceof arguments.callee) {
    console.log("此处作为构造函数被调用");
  } else {
    console.log("此处作为普通函数被调用");
  }
}
f(); //此处作为普通函数被调用
new f(); //此处作为构造函数被调用
```

:::tip
在函数内部，有两个特殊的对象：arguments 和 this。其中， arguments 的主要用途是保存函数参数， 但这个对象还有一个名叫 `callee` 的属性，该属性是一个指针，指向拥有这个 arguments 对象的函数。
:::

## typeof

简单判断 JavaScript 默认已有的类型，包括 number,boolean,string,function（函数）,object（NULL,数组，对象）,undefined。
