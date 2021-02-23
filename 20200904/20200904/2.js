/*
 * 数据类型检测
 *   + typeof 检测数据类型的运算符
 *     + 返回结果是一个字符串，字符串中包含了对应的数据类型 "number/string/boolean/undefined/symbol/bigint/object/function"  => typeof typeof xxx  结果都是：“string”    
 *    「小BUG」
 *     typeof的原理：按照计算机底层存储的二进制结果来进行检测的，对象都是以000...开始的
 *     + typeof null  "object"   =>null的二进制存储值000
 *     + 所有对象都是以000开始的，所以基于typeof检测的结果都是 "object"，也就是typeof无法细分是普通对象还是数组等对象
 * 
 *   + instancof
 *     + 并不是检测数据类型的，是用来检测当前实例是否属于这个类，只是被“打肿脸充胖子了”
 *     + 用它来检测，一般只应用于普通对象/数组对象/正则对象/日期对象等的具体细分的
 *     + “打肿脸充胖子”的东西就是不好用，存在很多问题
 * 
 *   + constructor
 *     + 一样是打肿脸充胖子，原本就是获取实例的构造函数的，基于这些特点可以充当数据类型检测
 *     + 而且这货比instancof还好用一些
 *     + 但是也不准确：constructor是可以随意被修改的
 * 
 *   + Object.prototype.toString.call([value]) 或者 ({}).toString.call([value])
 *     + 专门用来检测数据类型的(很强大很暴力的一种办法，基本零瑕疵)
 *     + Number/String/Boolean/Symbol/BigInt/Function/Array/RegExp/Date/Object...的原型上都有toString，除了Object.prototype.toString不是转换字符串的，其余都是，Object.prototype.toString是用来检测数据类型的
 *     + 返回结果 "[object 对象[Symbol.toStringTag]||对象.构造函数(不受自己更改的影响,对内置类有效)||Object]"
 */

//--------Object.prototype.toString.call([value])
// let class2type = {},
//     toString = class2type.toString; //Object.prototype.toString

/* class Person {
    // 只要获取实例的[Symbol.toStringTag]属性值，则调用这个方法
    get[Symbol.toStringTag]() {
        return "Person";
    }
}
let p1 = new Person; 
toString.call(p1) => "[object Person]" */

//--------typeof
/* function* fn() {
    yield 1;
}
console.log(typeof fn);  =>"function" */

//--------instanceof
/* let arr = [];
console.log(arr instanceof Array); //true
console.log(arr instanceof Object); //true 绝对不能证明 xxx instanceof Object 是true就是普通对象
console.log(arr instanceof RegExp); //false */

/* // instanceof无法应用到原始值类型数值的检测上
let n = 10;
let m = new Number(10);
console.log(n.toFixed(2)); //"10.00"  n是Number类的实例，只不过它是字面量方式创造出来的原始类型值而已（其实n.toFixed(2)的时候，n这个基本类型值浏览期内部也会把它 Object(n)一下，然后在调用方法，因为此时它就具备__proto__）
console.log(m.toFixed(2)); //"10.00"  m也是Number类的实例，只不过它是构造函数方式创造出来的引用类型值而已
console.log(n instanceof Number); //false
console.log(m instanceof Number); //true */

/* function Person() {}
Person.prototype = Array.prototype;
let p1 = new Person;
console.log(p1); //虽然p1可以基于__proto__找到Array.prototype，但是它不具备数组的任何特征(length/索引都没有的)，所以断定这货一定不是一个数组
console.log(p1 instanceof Array); //true */

/* 
let arr = [];
console.log(arr instanceof Array); //true
console.log(arr instanceof Object); //true 
console.log(Array[Symbol.hasInstance](arr)); //true   */
// + 基于 “实例 instanceof 类” 检测的时候，浏览器底层是这样处理的 “类[Symbol.hasInstance](实例)”
// + Function.prototype[Symbol.hasInstance]=function [Symbol.hasInstance](){[native code]}
// + Symbol.hasInstance方法执行的原理
//   + 根据当前实例的原型链上(__proto__)是否存在这个类的原型(prototype)
//   + arr.__proto__===Array.prototype   => arr instanceof Array  : true
//   + arr.__proto__.__proto__===Object.prototype => arr instanceof Object : true

// let obj = {};
// console.log(arr instanceof obj); //Uncaught TypeError: Right-hand side of 'instanceof' is not callable ，报错原因是因为 obj 是一个对象，它没有[Symbol.hasInstance]这个属性（函数才可以调用Function.prototype上的这个方法）

//--------constructor
/* let arr = [];
console.log(arr.constructor === Array); //true  在constructor不被修改的情况下，这样区分是数组还是普通对象
console.log(arr.constructor === Object); //false
console.log(arr.constructor === RegExp); //false */

/* function Person() {}
Person.prototype = Array.prototype;
let p1 = new Person;
console.log(p1.constructor === Array); //true 一但原型重定向，constructor也改了，所以也就不准了 */

/* let n = 10;
let m = new Number(10);
console.log(n.constructor === Number); //true
console.log(m.constructor === Number); //true */


// 重写instanceof
// + obj要检测的实例对象（不支持原始值类型）
// + constructor要检测的类（必须是一个函数）
function instance_of(obj, constructor) {
    // 参数校验
    if (obj == null || !/^(object|function)$/i.test(typeof obj)) return false;
    if (typeof constructor !== "function") throw new TypeError("Right-hand side of 'instanceof' is not callable");

    // obj.__proto__ === Object.getPrototypeOf(obj)
    let proto = Object.getPrototypeOf(obj),
        prototype = constructor.prototype;
    while (true) {
        // 找到Object.prototype.__proto__都没有相等的，则证明不是当前类的实例
        if (proto === null) return false;
        // 找到对象的原型链包含类的原型，则证明对象是类的一个实例
        if (proto === prototype) return true;
        // 一级级查找即可
        proto = Object.getPrototypeOf(proto);
    }
}
console.log(instance_of([], Array)); //true
console.log(instance_of([], Object)); //true
console.log(instance_of([], RegExp)); //false
console.log(instance_of(10, Number)); //false
console.log(instance_of(new Number(10), Number)); //true
console.log(instance_of([], {})); //报错