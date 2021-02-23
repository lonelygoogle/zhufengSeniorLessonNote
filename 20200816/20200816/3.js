/* 
 * 声明变量的五种方案：
 *   var function  传统
 *   let const import  ES6
 * 
 * let VS const
 *   let和const声明的都是变量，const声明的变量是不允许指针重新指向的（但是存储的值是可以改变的，例如：存储的值是引用数据类型，可以基于地址改变堆内存中的信息）
 */
// =赋值本身就是指针关联或者指针指向的过程
/* let n = 12;
n = 13;
console.log(n); // 13 */

/* const m = 12;
m = 13; // Uncaught TypeError: Assignment to constant variable.
console.log(m); */

/* const m = {
    name: 'zhufeng'
};
m.name = 'weixin';
console.log(m); */

//===========
/* var VS let
 *   + 带var/function的存在变量提升，而let/const不存在变量提升机制
 *   + 在相同的上下文中，let不允许重复声明（而且检测是否重复声明发生在“词法解析阶段”  词法解析->变量提升->代码执行，也就是词法解析阶段检测到重复声明，则直接报错，JS代码一行都不会执行）；且不论基于什么方式声明的变量，只要在当前上下文中有了，则不允许再基于let/const声明；
 *   + 暂时性死区（浏览器遗留BUG）：基于typeof检测一个未被声明的变量，不会报错，结果是undefined
 *   + 块级私有上下文（作用域）
 *     + 除函数或者对象的大括号之外，如果括号中出现 let/const/function 则会产生块级私有上下文
 *     + 当前块级上下文也只是对let/const/function他们声明的变量有作用
 */
//======
/* if (1 == 1) {
    var n = 12;
    console.log(n); //12
}
console.log(n); //12 */

/* if (1 == 1) {
    let n = 12;
    console.log(n); //12
}
console.log(n); //Uncaught ReferenceError: n is not defined */

/* if (1 == 1) {
    let n = 12;
    var m = 13; //依然是全局的，私有块级上下文对他无效
    console.log(n, m); // 12 13
}
console.log(m); //13
console.log(n); //Uncaught ReferenceError: n is not defined */

//======
// console.log(a); // Uncaught ReferenceError: a is not defined
// console.log(typeof a); // undefined

// console.log(typeof a); // Uncaught ReferenceError: Cannot access 'a' before initialization
// let a = 12;

//======
/* var n = 12;
var n = 13;
console.log(n); */

/* console.log('ok');
let n = 12;
let n = 13; // Uncaught SyntaxError: Identifier 'n' has already been declared
console.log(n); */

/* var n = 12;
let n = 12; // Uncaught SyntaxError: Identifier 'n' has already been declared */

//======
/* // 在全局代码执行之前，首先会变量提升：把当前上下文中所有带var/function关键字的提前声明或者定义（带var只是提前声明，带function会提前的声明+定义）
// var n;
console.log(n); // undefined
var n = 12; */

/* console.log(n); // Uncaught ReferenceError: Cannot access 'n' before initialization
let n = 12; */

/* 
// 变量提升：fn=0x000000;
// fn();
// function fn() {
//     console.log('ok');
// }

// 现在建议：函数表达式方式创建函数
// const fn = function () {
//     console.log('ok');
// };
// fn(); 
*/

// 函数的变量提升在“新版本浏览器”中很变态
// // 变量提升：fn=0x000000; 声明+定义
// console.log(fn); // 函数本身
// function fn() {
//     console.log('ok');
// }

/* // 变量提升阶段：
// [老版本浏览器] 不论条件是否成立，都要把fn声明+定义，而且fn只是全局上下文中的变量
// [新版本浏览器] 为了兼容ES3/ES6，规则处理的非常的复杂
//   全局变量提升：如果创建函数的代码出现在“非函数或者对象的大括号中（例如：判断体、循环体、代码块...）”，只会它进行声明，不进行赋值了  => function fn;
//   代码执行进入到大括号中：如果大括号中出现了 function xxx(){} ，此时当前大括号会形成一个私有的上下文，私有上下文中的第一件事情也是变量提升，它会把函数进行声明+定义
console.log(fn); // undefined ，老版本中还是函数本身
if (1 == 1) {
    // 私有上下文变量提升：fn=0x000000;
    console.log(fn); //函数
    function fn() { //代码执行到这的时候，会把私有上下文中，之前对于fn的操作，映射给全局一份
        console.log('ok');
    }
    fn = 12;
    console.log(fn); //12
}
console.log(fn); //函数 */


// debugger; //断点调试  F10/F11
/* console.log(fn);
if (1 == 1) {
    console.log(fn);

    function fn() {
        console.log('ok');
    }
    fn = 12;
    console.log(fn);
}
console.log(fn); */