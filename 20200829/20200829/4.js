const fn = function fn(x, y) {
    this.total = x + y;
    return this;
};
let obj = {
    name: 'obj',
    xxx: 10
};

Function.prototype.call = function call(context, ...params) {
    // this->fn 当前要处理的函数
    // context->obj 给函数改变的this
    // params->[10,20] 给函数传递的参数

    // 细节点：对于context类型的处理（基本数据类型无法设置键值对）
    context == null ? context = window : null;
    !/^(object|function)$/i.test(typeof context) ? context = Object(context) : null;

    // 细节点：建立关联的属性保持唯一 Symbol
    let result,
        key = Symbol('key');
    context[key] = this;
    result = context[key](...params);
    delete context[key];
    return result;
};

// let res = fn.call(100, 10, 20);
// console.log(res);

// 没关系，我们让你有关系
// obj.fn = fn;
// obj.fn(10, 20);
// delete obj.fn;


//=========================

// document.body.onclick = fn; //把fn本身绑定给点击事件
// document.body.onclick = fn(); //先把fn执行，把执行结果赋值给点击事件

/* 闭包：柯里化函数 */
Function.prototype.bind = function bind(context, ...params) {
    // this->fn 真正要执行的函数
    // context->obj 要给函数改变的this
    // params->[10,20] 要给函数传递的参数
    return (...args) => {
        // args->[ev] 点击行为触发，传递给匿名函数的信息，例如：事件对象    
        this.call(context, ...params.concat(args));
    };
};

document.body.onclick = fn.bind(obj, 10, 20);
// bind原理：执行bind只是先把fn/obj/10/20都存储起来，返回一个匿名函数做我们的事件绑定，当点击的时候，再把匿名函数执行，执行中，把事先存储的那些信息拿过来处理
// document.body.onclick = (ev) => { 
//     fn.call(obj, 10, 20, ev);
// };