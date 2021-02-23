/*
 * THIS：函数的执行主体，和执行上下文不是一个概念
 *   + 全局的this是window，我们研究的都是函数中的this
 *   + this是谁和函数在哪执行，以及在哪定义都没有必然的联系
 * 
 * 按照以下规律来确定执行主体是谁:
 *   1. 给当前元素的某个事件行为绑定方法，事件触发，执行对应的方法，方法中的this是当前元素本身（排除：IE6~8基于attachEvent实现的DOM2事件绑定，绑定的方法中的this不是操作的元素，而是window）
 *   2. 函数执行，首先看函数名之前是否有“点”，有“点”，“点”前面是谁this就是谁，没有“点”this就是window（在JS的严格模式下，没有“点”，方法中的this是undefined） 
 *      + 自执行函数中的this一般都是window/undefined
 *      + 回调函数中的this一般也都是window/undefined（除非特殊处理了）
 *      + ...
 *   3. 构造函数中的this是当前类的实例
 *   4. 箭头函数没有自己的this，用到的this都是上下文中的this
 *   5. 基于call/apply/bind可以强制改变this的指向
 */
// "use strict"; //全局上下文开启严格模式
// (function () {
//     "use strict"; //当前上下文开启严格模式
// })();

// document.body.onclick = function () {
//     // this : body
// };

/* function fn() {
    console.log(this);
}
let obj = {
    name: 'xxx',
    fn: fn
};
fn(); //this:window
obj.fn(); //this:obj */

/* var num = 10;
var obj = {
    num: 20
};
obj.fn = (function (num) {
    this.num = num * 3;
    num++;
    return function (n) {
        this.num += n;
        num++;
        console.log(num);
    }
})(obj.num);
var fn = obj.fn;
fn(5);
obj.fn(10);
console.log(num, obj.num); */


/* let obj = {
    // fn等于返回的小函数
    fn: (function () {
        return function () {
            console.log(this);
        }
    })()
};
obj.fn(); //this->obj
let fn = obj.fn;
fn(); //this->window */


/* var fullName = 'language'; // window.fullName='language'
var obj = {
    fullName: 'javascript',
    prop: {
        getFullName: function () {
            return this.fullName;
        }
    }
};
console.log(obj.prop.getFullName());
// this->obj.prop
// this.fullName -> obj.prop.fullName => undefined

var test = obj.prop.getFullName;
console.log(test());
// this->window
// this.fullName -> window.fullName => 'language' */

/* var name = 'window';
var Tom = {
    name: "Tom",
    show: function () {
        // this -> window
        console.log(this.name);
    },
    wait: function () {
        // this -> Tom
        var fun = this.show; // fn=Tom.show
        fun();
    }
};
Tom.wait(); */

/* window.val = 1;
var json = {
    val: 10,
    dbl: function () {
        this.val *= 2;
    }
}
json.dbl();
// this -> json
// this.val *= 2 -> json.val*=2 => json.val=20

var dbl = json.dbl;
dbl();
// this -> window
// this.val *= 2 -> window.val*=2 => window.val=2

json.dbl.call(window);
// this -> window
// this.val *= 2 -> window.val*=2 => window.val=4

alert(window.val + json.val); //"24" */

/* (function () {
    var val = 1; //2
    var json = {
        val: 10,
        dbl: function () {
            // this -> json
            val *= 2; // val = val * 2  
            // val是变量，不是自己的私有变量，是自执行函数执行创建出来的上下文中的变量
        }
    };
    json.dbl();
    alert(json.val + val); //=>"12"
})(); */