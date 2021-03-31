/* // 写在内置类原型上的方法，实例调用的时候：“实例.xxx()” 
//   + xxx方法执行
//   + 方法中的this是要操作的实例
//「向内置类原型扩充方法」：把一些公共的方法扩展到内置类的原型上，这样调用起来非常的方便
//   + 我们自定义的属性方法名最好设置前缀: myXxx，为了防止自己的方法覆盖默认的方法
//「链式写法」：保证上一个方法执行完，返回的结果依然是某个类的实例，这样就可以继续调用这个类原型上的方法了
Array.prototype.unique = function unique() {
    // 保证：this是当前要操作的数组
    if (!Array.isArray(this)) throw new TypeError('确保操作的是一个数组!');
    return Array.from(new Set(this));
};

let arr = [1, 3, 2, 3, 4, 4, 2, 2, 1, 2, 3, 4, 2];
// console.log(arr.unique().sort((a, b) => a - b));
// console.log(arr.unique().sort((a, b) => a - b).push('珠峰培训').shift()); //Uncaught TypeError: arr.unique(...).sort(...).push(...).shift is not a function 执行push方法后返回的是一个数字（新增后数组长度），则不能再调用数组上的方法了
// console.log(arr.unique().sort((a, b) => a - b).push('珠峰培训').toFixed(2).split('.')...); */

/* function unique(arr) {
    arr = new Set(arr);
    arr = Array.from(arr);
    return arr;
}
console.log(unique(arr)); */

//============
/*
 * JS中创建值有两种方案：
 *   + 字面量方式  
 *   + 构造函数方式
 * 不论哪一种方法，创造出来的值都是所属类的实例
 * 
 *「基本数据类型值」
 *   + 字面量方式创造出来的是基本类型
 *   + 构造函数创造出来的是引用数据类型
 *   + Symbol和BigInt不是构造函数，不能使用new执行来创建值
 * 
 *「引用数据类型值」
 *   + 两种创建方法的结果是一样的
 *   + “new 类” 传递的参数不同，得到的结果也是不一样的
 */
// let n = 10;
// let m = new Number(10);
// // m.toFixed(2);
// // n.toFixed(2); 浏览器在处理基本值调用原型上方法的时候，其实内部也是会把基本类型值变为对象实例模式，再次调用的

// let obj1 = {};
// let obj2 = new Object();

const validateNum = function validateNum(num) {
    num = Number(num);
    return isNaN(num) ? 0 : num;
};
Number.prototype.plus = function plus(num) {
    // THIS是引用数据类型值（基于call/apply/bind等改变this指向，this可以是基本数据类型的值）
    // console.log(typeof this); //=>"object"
    // 对象+数值：大部分情况都会变为字符串拼接，除 {}+num 及 当前对象有原始值[[PrimitiveValue]]
    //  + 把对象转换为数字，首先调用valueOf方法获取原始值(number/string/boolean/Date...)，如果有原始值，则直接获取到原始值的结果即可，并且可以参与到后续的运算中
    //  + 如果没有原始值，则继续调用toString先转换为字符串，后续再基于Number转换为数字
    num = validateNum(num);
    return this + num;
};
Number.prototype.minus = function minus(num) {
    num = validateNum(num);
    return this - num;
};

let n = 10;
let m = n.plus(10).minus(5);
console.log(m); //=>15（10+10-5）