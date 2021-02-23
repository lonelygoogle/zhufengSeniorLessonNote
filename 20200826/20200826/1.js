/*
 * new执行的特点:
 *   1. 和普通函数执行一样，形成私有上下文EC(xxx)、AO(xxx)、作用域链... 「普通函数」
 *   2. 也有自己特殊的处理  「构造函数」
 */
/* function sum(x, y) {
    let total = x + y;
    this.total = total;
    return total;
}
let res = new sum(10, 20);
console.log(res); */

// let res = sum(10, 20);
// console.log(res); // 30  window.total=30

// ================
// 内置类首字母大写，所以自己创造的类首字母也会大写
// + 所有的类都是一个函数数据类型的值（构造函数）：内置类 / 自定义类
// + typeof Object  => "function"
function Fn(x = 0, y = 0) {
    let str = `珠峰培训`;
    this.total = x + y;
    this.say = function () {
        console.log('OK');
    };
}
let f1 = new Fn(10, 20);
// console.log(f1.total); // 30
// console.log(f1.say); // 函数
// console.log(f1.str); // undefiend  str是私有上下文中的私有变量，和实例没关系，this.xxx=xxx才是给实例设置的私有属性方法

let f2 = new Fn;
//这样Fn也和上面一样执行了  
// + new Fn(); 带参数列表的new  优先级19
// + new Fn; 不带参数列表的new   优先级18
// 最后Fn都一定会执行，而且都会创造这个类的实例，区别：是否传递实参，以及运算优先级不一样

// console.log(f1 === f2); // false 每一次new类创造的实例都是“独立的实例对象”「很多人把这个称为“单例设计模式”的原因也是如此，这种模式在JS中有单独称呼“构造函数模式”」
// console.log(f1.say === f2.say); // false 私有的属性方法

// instanceof用来检测某个实例是否率属于这个类「也可以基于这种办法检测数据类型：有坑，慎用」
// console.log(f1 instanceof Fn); // true
// console.log(f1 instanceof Array); // false
// let arr = [];
// console.log(arr instanceof Array); // true
// console.log(arr instanceof RegExp); // false

// 检测当前属性是否属于这个对象「in操作符」：不论是私有还是共有的，只要有检测结果就是true
// 以及是否为他的私有属性「hasOwnProperty」：必须是私有的属性，共有的不算
//  + 所有实例对象（除去基本数据类型之外）都是对象类型（最后都是Object的一个实例）
//  + 所以可以使用Object.prototype上提供的hasOwnProperty方法，来检测某个属性是否为对象的一个私有属性
// console.log('say' in f1); //true
// console.log('str' in f1); //false
// console.log(f1.hasOwnProperty('say')); //true