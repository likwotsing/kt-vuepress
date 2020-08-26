# TypeScript

## 初识

[TypeScript](https://www.typescriptlang.org/)是JavaScript的一个超集，添加了可选的静态类型和基于类的面向对象编程。TypeScript是为大型应用的开发而设计。

> TypeScript在开发时就能给出编译错误，而JavaScript错误则需要在运行时才能暴露。

安装：

```js
npm install -g typescript
```

```typescript
// index.ts
var a:string = '2';
```

编译：

```js
tsc index.ts
```

## 基本数据类型

原始数据类型有6种：boolean、number、string、null、undefined、Symbol

非原始数据类型有9种：数组、Tuple元组、enum枚举、never用不存在的值、void、any任意类型、联合类型、函数类型、对象类型。

其中元组、枚举、any、void、never是TypeScript特有的类型。

```ts
// index.ts
let flag:boolean = false;
let num:number = 10;
let str:string = 'a';
function sayHi():void {
    console.log('hi');
}
// 声明void类型的变量没有什么用，因为只能将它赋值为undefined和null
let unde:void = undefined;
let nu:void = null;
```

### 数组

定义数组有2种方式：

1. 普通方式，在**元素类型**后面加上`[]`，表示此类型元素组成的一个数组

   ```ts
   let arr:number[] = [1,2,3]
   ```

2. 泛型方式`Array<元素类型>`

   ```ts
   let arr:Array<number> = [1,2,3]
   ```

### 元组

元组类型表示一个已知元素数量和类型的数据，各元素的类型不必相同。

```ts
let x:[string, number];
x = ['hello', 10]
```

### 枚举

- 数字枚举，元素编号默认从0开始，也可以手动指定

  ```ts
  enum months {
      January,
      February,
      March,
      April,
      May,
      June,
      July,
      August,
      September,
      October,
      November,
      December
  }
  ```

- 字符串枚举

  ```ts
  enum Person {
      name = 'andy',
      age = 10,
      gender = 'male'
  }
  console.log(Person.name) // andy
  ```

### never

never类型是任何类型的子类型，可以赋值给任何类型，一般作为函数返回值。

```ts
function error(err:string):never {
    throw new Error(err)
}
```

### void

void表示没有任何类型，一般用作函数的返回值

```ts
function sayHi():void {
    console.log('hi')
}
```

### any

any表示允许赋值为任意类型。当声明一个变量为any类型后，对该变量的任何操作，返回内容的类型是任意的。

> 如果在声明的时候，未指定变量类型，那么它会被识别为任意类型。

如果不希望类型检查器对某些变量进行检查，可以使用any类型来标记这些变量。

### 联合类型

联合类型(Union Types)表示取值可以为多种类型中的一种。

> 多种类型之间使用`|`分割。

```ts
let num:string | number;
num = 'a';
num = 10;
```

### 对象类型

object表示对象类型

```ts
declare function create(o:object | null):void;
create({ name: 'andy' });
create(null)
create(undefined) // 报错
create(1); // 报错
```

### 类型断言

类型断言可以手动指定一个值的类型，即允许变量从一种类型更改为另一种类型。有2种方式：

1. <类型>值

   ```ts
   let aaa:any = 'andy';
   let len:number = (<string>aaa).length;
   ```

2. 值 `as` 类型

   ```ts
   let aaa:any = 'andy';
   let len:number = (aaa as string).length;
   ```

## 接口

接口(Interface)用来定义对象的类型。

- 对类的一部分行为进行抽象
- 描述对象的形状

> 接口一般首字母大写，或者在接口之前加大写`I`，赋值的时候，变量的形状必须和接口的形状保持一致，**不允许添加未定义的属性**。

```ts
interface Person {
    name: string;
    age: number;
}
let andy:Person {
    name: 'andy',
    age: 20
}
```

### 可选属性

在属性后面使用`?`表示该属性是可选属性，可选属性可以不存在。

```ts
interface Person {
    name: string;
    age?: number; // 可选属性
}
let andy:Person = {
    name: 'andy'
}
```

### 任意属性

使用`[propName:string]`定义了任意属性的类型为`string`。

```ts
interface Person {
    name: string;
    age?: number;
    [propName: string]: any; // 类型是any
}
let andy:Person = {
    name: 'andy',
    gender: 'male',
    graduted: false
}
```

### 只读属性

只读属性只能在创建的时候被赋值，使用`readonly`定义。

```ts
interface Person {
    readonly id:number;
    name: string;
}
let andy:Person = {
    id: 1,
    name: 'andy'
}
andy.id = 2; // 报错
```

## 类

类定义了一个事物的抽象特点，包含属性和方法。

**对象**：类的实例，通过new生成。

面向对象的三大特性：封装、继承、多态。

**封装**：将对数据操作细节隐藏起来，只暴露对外的接口。

**继承：**子类承父类，子类除了拥有父类的所有特性外，还可以有一些其他特性。

**多态：**由继承而产生了相关的不同的类，对同一个方法可以有不同的响应。比如cat和dog都继承自animate，但是分别实现了自己的run方法。此时针对某一个实例，无需关心它是cat还是dog，直接调用run方法，程序会执行对应的run。

**存取器：**getter和setter，改变属性的读取和赋值行为。

**接口：**不同类之间公有的属性或方法，可以抽象成一个接口。接口可以被类实现(implements)。一个类只能继承自另一个类，但可以使实现多个接口。

### 类的定义

使用`class`定义类，使用`constructor`定义构造函数。

```ts
class Greeter {
    greeting: string;
    constructor(msg:string) {
        this.greeting = msg;
    }
    great() {
        console.log('Hello, ' + this.greeting)
    }
}
let greeter = new Greeter('world')
greeter.great();
```

### 类的继承

使用`extends`关键字实现继承，子类中使用`super`关键字调用父类的构造函数和方法。

```ts
class Person {
    name: string;
	constructor(name:string) {
        this.name = name;
    }
	run():void {
        console.log(`${this.name}在跑`)
    }
}
let p = new Person('father')
p.run(); // father在跑
class Child extends Person {
    constructor(name:string) {
        super(); // 初始化父类的构造函数
    }
}
let c = new Child('son')
c.run(); // son在跑
```

### 修饰符

修饰符是一些关键字，用于限定成员或类型的性质。

TypeScript在定义属性时有3种修饰符：

- public：公有，在当前类、子类、类外面都可以访问
- protected：保护类型，在当前类、子类里面可以访问，在类外部不可以访问
- private：私有，在当前类可以访问，在子类、类外部都不可以访问。

> 属性如果不加修饰符，默认就是public

### 静态属性和方法

使用`static`修饰符修饰的方法称为静态方法，它们不需要实例化，而是直接通过类来调用。若加上修饰符，和其他属性和方法效果一样。

### 抽象类

抽象类是供其他类继承的类。

- 抽象类不允许被实例化。
- 抽象类中的抽象方法必须在子类中被实现

## 函数

### 可选参数

JavaScript里函数的实参和形参可以不一样，但是TypeScript中必须一样，如果不一样就需要配置可选参数。

> 可选参数必须配置到参数的最后面

```ts
functon getInfo(name:string, age?:number):string {
    if (age) { // 可选参数age
        return `姓名：${name}, 年龄：${age}`
    } else {
        return `姓名：${name}, 年龄：保密`
    }
}
getInfo('zs', 20)
getInfo('ls')
```

### 默认参数

ES5不能设置默认参数，ES6和TypeScript里都可以设置默认参数。

```js
functon getInfo(name:string, age?:number = 20):string {
    if (age) { // 可选参数age
        return `姓名：${name}, 年龄：${age}`
    } else {
        return `姓名：${name}, 年龄：保密`
    }
}
getInfo('ls') // 姓名：ls，年龄：20
```

### 剩余参数

ES6中，可以使用`...rest`的方法获取函数中的剩余参数。

```ts
// ES6
function myPush(arr,...items) {
    items.forEach(item => arr.push(item))
}
let a = []
myPush(a,1,2,3)
```

```ts
// TypeScript index.ts
function myPush(arr:any[],...items:any[]) {
    items.forEach(item => arr.push(item))
}
let a = []
myPush(a,1,2,3)
```

### 用接口定义函数的形状

```ts
interface Fn {
    // 坐标表示函数的输入类型，右边表示输出类型
    (x:number, y:number):boolean;
}
let fn:Fn;
fn = function(x:number,y:number) {
    return x > y;
}
```

### 函数重载

TypeScript的重载：通过为同一个函数提供多个函数类型定义来实现多种功能。

```js
// JavaScript
function getInfo(name) {}
function getInfo(name,age) {} // 下面的getInfo会覆盖上面的
```

**单个参数，不同类型：**

```ts
function getInfo(name:string):string;
function getInfo(age:number):string;
function getInfo(str:any):any {
    if (typeof str === 'string') {
        console.log(`姓名：${str}`)
    } else {
        console.log(`年龄：${str}`)
    }
}
getInfo('andy')
getInfo(20)
getInfo(true) // 报错
```

**多个参数，可选参数：**

```ts
function getInfo(name:string):string;
function getInfo(name:string,age:number):string;
function getInfo(name:string,age?:number):void {
    if (age) {
        console.log(`姓名：${name}, 年龄:${age}`)
    } else {
        console.log(`姓名：${name}`)
    }
}
getInfo('andy')
getInfo('20') // 报错
getInfo('bob', 20)
```

##　模块

## 命名空间

