function Dog(name, age) {
    this.name = name;
}
Dog.prototype.bark = function () {
    console.log('wangwang');
}
Dog.prototype.sayName = function () {
    console.log('my name is ' + this.name);
}

/* let sanmao = new Dog('三毛');
sanmao.sayName();
sanmao.bark(); */

/* // Func[function]：想创造哪个类的实例,就传递这个类
// params[array]：基于剩余运算符获取其余传递的实参，这些值都是给类传递的实参
function _new(Func, ...params) {
    // 创建一个实例对象
    let obj = {};
    obj.__proto__ = Func.prototype;

    // 把类当作普通函数执行:基于call方法强制改变上下文中的this是创建的实例对象obj
    let result = Func.call(obj, ...params);

    // 根据返回结果类型，决定返回啥
    if (result !== null && /^(object|function)$/i.test(typeof result)) return result;
    return obj;
} */

// Object.create是ES2015（不是ES5，是ES6前身）提供的方法，不兼容低版本浏览器
Object.create = function create(obj) {
    if (obj === null || typeof obj !== "object") {
        throw new TypeError('Object prototype may only be an Object');
    }

    function Anonymous() {}
    Anonymous.prototype = obj;
    return new Anonymous;
};

function _new(Func, ...params) {
    // 优化：不用__proto___（IE不兼容）
    let obj = Object.create(Func.prototype);
    let result = Func.call(obj, ...params);
    if (result !== null && /^(object|function)$/i.test(typeof result)) return result;
    return obj;
}

let sanmao = _new(Dog, '三毛', 25);
sanmao.bark(); //=>"wangwang"
sanmao.sayName(); //=>"my name is 三毛"
console.log(sanmao instanceof Dog); //=>true


// new Dog(...)
//  + 创建一个Dog类实例对象
//     + 对象(空)
//     + 对象.__proto__===Dog.prototype
//  + 把Dog当作普通函数执行:私有上下文/作用域链/形参赋值/变量提升/代码执行...
//  + 方法中的this指向创建的实例对象
//  + 看方法返回结果，如果没有return或者返回的是基本类型值，则返回的都是实例对象，否则以函数返回值为主

/* // Object.create([对象A]):创建一个空对象，并且把对象A作为他的原型   空对象.__proto__===对象A
let obj = {
    xxx: 'xxx'
};
console.log(Object.create(obj));
// console.log(Object.create()); //Uncaught TypeError: Object prototype may only be an Object or null
// console.log(Object.create(null)); //创建一个空对象，但是此对象__proto__等于null(没有)，此空对象不再是任何类的实例 */