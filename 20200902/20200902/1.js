Function.prototype.call = function call(context, ...params) {
    context == null ? context = window : null;
    !/^(object|function)$/i.test(typeof context) ? context = Object(context) : null;
    let result,
        key = Symbol('key');
    context[key] = this;
    result = context[key](...params);
    delete context[key];
    return result;
};

/* var name = '珠峰培训';
function A(x, y) {
    var res = x + y;
    console.log(res, this.name);
}
function B(x, y) {
    var res = x - y;
    console.log(res, this.name);
}
B.call(A, 40, 30);
B.call.call.call(A, 20, 10);
Function.prototype.call(A, 60, 50);
Function.prototype.call.call.call(A, 80, 70); */


/* function C1(name) {
    if (name) {
        this.name = name;
    }
}

function C2(name) {
    this.name = name;
}

function C3(name) {
    this.name = name || 'join';
}
C1.prototype.name = 'Tom';
C2.prototype.name = 'Tom';
C3.prototype.name = 'Tom';
alert((new C1().name) + (new C2().name) + (new C3().name)); */


// Array.prototype.push = function push(value) {
//     // this -> arr
//     // value -> 30
//     // 1.把value放到末尾
//     // this[this.length]=value;

//     // 2.长度累加(上述代码完成长度自己就累加了,但是我们需要清楚它一定有一个累加的过程)
//     // this.length++;
// };
// let arr = [10, 20];
// arr.push(30);

/* let obj = {
    2: 3, //1
    3: 4, //2
    length: 2, //3 4
    push: Array.prototype.push
}
obj.push(1);
// 把push方法执行：this->obj  value->1
// obj[obj.length]=1  obj[2]=1
// obj.length++  

obj.push(2);
// 把push方法执行：this->obj  value->2
// obj[obj.length]=2  obj[3]=2
// obj.length++

console.log(obj); */

//===========================
// ==比较的时候，两边类型不一样，会默认转转为一样的，然后再进行比较（隐式转换)
// 对象==字符串：把对象转换为字符串
// null==undefined  null/undefined和其他任何值都不相等
// 剩下的情况都是转换为数字
//------
// 对象转换为数字，浏览器底层如下处理：
// + 首先调取对象中 [Symbol.toPrimitive] 的这个属性(属性值是函数)：获取原始值，如果这个函数不存在
// + 继续调用对象的 valueOf 方法，如果也不存在，或者获取的结果并不是原始值
// + 则继续调用对象的 toString 方法，先转换为字符串，再把字符串转换为数字

// let obj = {};
// console.log(obj[Symbol.toPrimitive]); //undefined
// let n = 10; //字面量方式创建值:基本类型值/原始类型/值类型
// let n = new Number(10); //构造函数方式创建值:引用数据类型
// console.log(n.valueOf()); //10
// + 基本数据类型值所属类的原型上都有valueOf方法，获取其原始值
// + Object.prototype.valueOf：此方法获取的结果是引用类型值（不算原始值，原始之一般指的是基本类型值）
//    + Object.prototype.valueOf.call(10) => new Number(10)
//    + 数组/正则/函数所属类的原型上都没有valueOf，调用的都是Object.prototype.valueOf
// + Date.prototype.valueOf：获取日期对象的原始值（距离1970-01-01 00:00:00 之间的毫秒差）
// console.log(new Date() - 10); //1599051256501
// console.log(({})-10); //NaN
// console.log(new Number(10)+10); //20


/* 方案1:利用数据类型转换的机制，我们重写方法实现效果 */
/* var a = {
    value: 0,
    // valueOf / toString
    [Symbol.toPrimitive](hint) {
        // 浏览器调取这个方法的时候会传递一个hint：存储当前对象即将转换为什么值
        // + default:可能转换为数字或者字符串，例如：==比较或者加号运算
        // + number:一定是要转换为数字的，例如：减乘除等数学运算中
        // + string:一定是要转换为字符串的，例如：字符串拼接
        return ++this.value;
    }
};
// 隐式调用：a[Symbol.toPrimitive]
if (a == 1 && a == 2 && a == 3) {
    console.log('OK');
} */

/* let a = [1, 2, 3];
a.toString = a.shift;
if (a == 1 && a == 2 && a == 3) {
    console.log('OK');
} */

/* 方案二：利用数据劫持 Object.defineProperty / Proxy */
/* // 如果a不是全局变量，则再看是否为window的一个属性...
let i = 0;
Object.defineProperty(window, 'a', {
    get() {
        // window.a 触发GETTER函数
        return ++i;
    },
    set(value) {
        // window.a=xxx 触发SETTER函数
    }
});
if (a == 1 && a == 2 && a == 3) {
    console.log('OK');
} */


let utils = (function () {
    /*
     * toArray：转换为数组的方法
     *   @params
     *      不固定数量，不固定类型
     *   @return
     *      [Array] 返回的处理后的新数组
     * by zhufengpeixun on 2020
     */
    /* function toArray(...args) {
        // ES6剩余运算符接收到的实参本身就放到了数组中
        return args;
    } */

    /* function toArray() {
        // arguments获取的是类数组，需要把它转换为数组
        // return Array.from(arguments); //ES2015
        // return [...arguments]; //ES6中的展开运算符
    } */

    function toArray() {
        /* let arr = [];
        for (let i = 0; i < arguments.length; i++) {
            arr.push(arguments[i]);
        }
        return arr; */
        // JS中的“鸭子”类型：arguments本身不是数组，但是结构和数组类似（超级类似：数字索引、逐级底层、length存储集合长度...），因为这样的原因，数组的一些代码操作，同样适用于类数组 =>arguments本身不是数组,不能直接调用数组的方法,但是我们可以让其借用数组的方法执行（让数组方法执行的时候，方法中的this是arguments类数组，这样就相当于在操作这个类数组）
        return [].slice.call(arguments);
    }

    return {
        toArray
    };
})();
/* let ary = utils.toArray(10, 20, 30); //=>[10,20,30]
console.log(ary);
ary = utils.toArray('A', 10, 20, 30); //=>['A',10,20,30]
console.log(ary); */

/* // 重写内置的slice，实现浅克隆的效果
Array.prototype.slice = function slice() {
    // this -> ary
    let arr = [];
    for (let i = 0; i < this.length; i++) {
        arr.push(this[i]);
    }
    return arr;
};
let ary = [10, 20, 30];
console.log(ary.slice()); //slice()或者slice(0)都是实现数组的浅克隆 */

/* // 类数组(arguments/NodeList/HTMLCollection/JQ集合...)
let obj = {
    0: 10,
    1: 20,
    2: 30,
    length: 3
};
// 数组中的其他方法一样可以被借用
// obj.forEach():Uncaught TypeError: obj.forEach is not a function
Array.prototype.forEach.call(obj, (item, index) => {
    console.log(item, index);
});
// console.log(Array.from(obj)); */