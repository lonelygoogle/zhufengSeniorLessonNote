/*
 * 关于JS中THIS的处理情况汇总
 *   1. 给当前元素的某个事件行为绑定方法，当事件行为触发，方法被执行，方法中的this一般都是当前操作的元素
 *      + 排除：IE6～8中，基于attachEvent进行的DOM2事件绑定，方法中的this是window  
 *   2. 函数执行，看函数前面是否有“点”，有“点”，“点”前面是谁this就是谁，没有“点”，this是window
 *      + JS严格模式下，没有“点”，this是undefined
 *      + 匿名函数(自执行函数/回调函数)一般this也是window/undefined,除非有特殊的处理
 *      + 括号表达式中有特殊的处理
 *   3. 构造函数执行 “new xxx”，函数体中的this是当前类的实例
 *   4. ES6中的箭头函数（或者基于{}形成的块级上下文）里面没有this，如果代码中遇到this也不是自己的，而是它所在上下文中的this
 *   5. 我们可以基于Function.prototype上的call/apply/bind方法强制改变函数中的this指向
 *      + 对箭头函数没用，因为它压根就不存在this 
 */

const fn = function fn(x, y) {
    this.total = x + y;
    console.log(this);
    return this;
};
window.name = '珠峰';
let obj = {
    name: 'obj'
};
// fn(); //this->window '珠峰'
// obj.fn(); //Uncaught TypeError: obj.fn is not a function  obj和fn没有关系

// ==bind==
// call/apply在执行的时候，都会立即把要操作的函数执行，并且改变它的this指向
// bind是预先处理：执行bind只是预先把函数中需要改变的this等信息存储起来（预设好），但是此时函数并不会被执行，执行bind会返回一个匿名函数，当后期执行匿名函数的时候，再去把之前需要执行的函数执行，并且改变this为预设的值
// let anonymous = fn.bind(obj, 10, 20); //执行bind的时候,fn是不会执行的
// console.log(anonymous); //后期执行把返回的函数再执行，在里面才会把fn执行，并且按照预设的信息改变this等 

// 需求：1s后执行fn，并且让fn中的this变为obj，传递10,20
// setTimeout(fn, 1000); //1000ms后执行fn，但是this->window，x/y都是undefined
// setTimeout(fn.call(obj, 10, 20), 1000); //这样处理不行，因为在设置定时器的时候，基于call方法，就把fn已经执行了，虽然this和参数都是我们想要的，但是并不是在1000ms后执行的 =>把fn执行的返回结果绑定给定四期，1000ms后执行的是返回结果

// 这样处理是可以的
// setTimeout(function () {
//     fn.call(obj, 10, 20);
// }, 1000);
// setTimeout(fn.bind(obj, 10, 20), 1000);

// ==apply==
// 函数.apply([context],[params1,params2,...])
// call和apply的唯一区别：执行函数的时候，需要传递给函数的参数信息，在最开始传递给call/apply的时候，形式不一样
//  + call是需要把参数一个个传递给call，call方法内部再一个个传递给函数
//  + apply是需要把参数放在一个数组中传递给apply，但是apply内部也会帮我们把接受数组中的每一项一项项的传递给函数
// fn.apply(obj, [10, 20]);

// ==call==
// 函数.call([context],params1,params2,...)
// 简单说明：把函数执行，让函数中的this指向[context]，并且把params1/params2...作为实参传递给函数
// 详细说明：
//   + 首先fn基于原型链__proto__，找到Function.prototype.call方法，并且把call方法执行
//   + call方法中的this就是当前操作的实例fn，传递给call方法的第一个实参是未来改变fn中的this指向，剩余的实参，都是未来要依次传递给fn的参数信息
//   + call方法执行的过程中，实现了这样的处理：把fn「call中的this」执行，让fn中的this指向[context]，并且把params1/params2...作为实参传递给fn，以此达到最后的效果
//   + 最后接受fn执行的返回结果，作为返回值反给外部
// let res = fn.call(obj, 10, 20);
// fn.call(10, 20); //fn: this->10 x=20 y=undefined
// fn.call(); //fn: this->window  第一个参数不传或者传递的是null/undefined，在JS非严格模式下，最后fn中的this都是window（严格模式下，不传this是undefined，传递null/undefined，this也会改为对应的值）


/* let obj = {
    name: 'obj',
    // fn:function(){}
    fn() {
        // this->obj

        /!* setTimeout(function () {
            // this->window
            this.name = "珠峰";
        }, 1000); *!/

        // 需求：1S后执行函数，把obj.name改为珠峰
        /!* let that = this;
        setTimeout(function () {
            // that存储的是上级上下文中的this
            that.name = '珠峰';
        }, 1000); *!/

        // 简单的办法：使用箭头函数
        setTimeout(() => {
            // this->用的是上级上下文中的this,也就是obj
            this.name = '珠峰';
            console.log(this);
        }, 1000);
    }
};
obj.fn(); */

/* 
function Fn() {
    this.x = 100;
}
Fn.prototype.sum = function () {};
Fn(); //this->window
let f = new Fn(); //this->f
f.sum(); //this->f
f.__proto__.sum(); //this->f.__proto__ 
*/

/* 
const fn = function () {
    console.log(this);
};
let obj = {
    name: 'obj',
    fn: fn
};
// (obj.fn)(); //this->obj
// // 括号表达式中有多项，也只取最后一项：但是this是window，而不是之前的obj
// (10, 20, obj.fn)(); //this->window

// fn(); //this->window/undefined
// obj.fn(); //this->obj

// (function () {
//     console.log(this); //window/undefined
// })();

// [1, 2].sort(function (a, b) {
//     console.log(this); //window
// });

// [1].forEach(function (item, index) {
//     // forEach内部做了特殊的处理，传递的第二个参数是为了改变回调函数中的this指向的
//     console.log(this); //obj
// }, obj); 
*/

/* document.body.onclick = function () {
    console.log(this);
};
document.body.addEventListener('click', function () {
    console.log(this);
}); */