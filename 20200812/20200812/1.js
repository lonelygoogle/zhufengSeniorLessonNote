/*
 * 基本数据类型（原始值类型）： 
 *   + number   NaN/Infinity
 *   + string   单引号/双引号/反引号``
 *   + boolean  true/false
 *   + null     
 *   + undefined 
 *   + symbol   创建唯一值
 *   + bigint   
 * 引用数据类型:
 *   + object
 *     + {} 普通对象
 *     + [] 数组对象
 *     + /^[+-]?(?:\d|(?:[1-9]\d+))(\.\d+)?$/ 正则对象
 *     + 日期对象
 *     + ...
 *   + function
 */

// NaN:not a number 不是一个有效数字,但是它属于number数据类型的
// console.log(typeof NaN); //=>"number"
// console.log(NaN == NaN); //=>false
// let n = 10;
// if (isNaN(n)) {
//     // 条件成立：证明它真的是非有效数字
// }
// Object.is([val1],[val2])：检测两个值是否相等
// console.log(Object.is(NaN, NaN)); //=>true

// 唯一值
// let val = Symbol('00');
// console.log(val == val); //=>true
// console.log(Symbol('AA') == Symbol('AA')); //=>false
// let a = NaN;
// console.log(a == a); //=>false

// console.log(Number.MAX_SAFE_INTEGER); //JS中的最大安全数，超过这个值的，需要用bigint处理（在一个数值后面加n就是bigint类型）

/* let res = parseFloat('left:200px'); //NaN
if (res === 200) {
    alert(200);
} else if (res === NaN) { //NaN!==NaN
    alert(NaN);
} else if (typeof res === 'number') {
    // typeof NaN==="number"
    alert('number'); //=>"number"
} else {
    alert('Invalid Number');
} */

// =========为啥分成两大类型，两种类型有啥区别？
/*
 * JS代码可以运行的环境：
 *   + 浏览器（引擎/内核）
 *   + node.js
 *   + webview
 *   + ... 
 */
var a = 12;
var b = a;
b = 13;
console.log(a); //12

var a = {
    n: 12
};
var b = a;
b.n = 13;
console.log(a.n); //13

var a = {
    n: 12
};
var b = a;
b = {
    n: 13
};
console.log(a.n);  //12