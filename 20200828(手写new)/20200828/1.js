/* function Fn() {
    this.x = 100;
    this.y = 200;
    this.getX = function () {
        console.log(this.x);
    }
}
Fn.prototype.getX = function () {
    console.log(this.x);
};
Fn.prototype.getY = function () {
    console.log(this.y);
};
let f1 = new Fn;
let f2 = new Fn;
console.log(f1.getX === f2.getX);
console.log(f1.getY === f2.getY);
console.log(f1.__proto__.getY === Fn.prototype.getY);
console.log(f1.__proto__.getX === f2.getX);
console.log(f1.getX === Fn.prototype.getX);
console.log(f1.constructor);
console.log(Fn.prototype.__proto__.constructor);
f1.getX();
f1.__proto__.getX();
f2.getY();
Fn.prototype.getY(); */

//=================
/* function Fn() {
    this.x = 100;
    this.y = 200;
}
// 原始原型对象
Fn.prototype.getX = function () {};
// 重定向的新对象：没有constructor，也没有getX了...
Fn.prototype = {
    getY: function () {}
};
let f1 = new Fn; */

/* function Fn() {
    this.x = 100;
    this.y = 200;
}
// 设置别名：治标不治本
// let A = Fn.prototype;
// A.getX = function () {};
// A.getY = function () {};
// A.getZ = function () {};

// 重定向是最常用的
Fn.prototype = {
    getX() {},
    getY() {},
    getZ() {}
};
let f1 = new Fn; */

/* function Fn() {
    this.x = 100;
    this.y = 200;
}
Fn.prototype = {
    // 原始原型对象上如果不存在其他属性方法，我们只需要把constructor手动设置一下即可
    constructor: Fn,
    getX() {},
    getY() {},
    getZ() {}
};
let f1 = new Fn; */

/* function Fn() {
    this.x = 100;
    this.y = 200;
}
Fn.prototype.z = 300;
// 重定向之前，最好拿新原型对象和原始的原型对象合并一下 
// Object.assign(对象1,对象2)：合并两个对象，重复的属性以对象2为主
Fn.prototype = Object.assign(Fn.prototype, {
    getX() {},
    getY() {},
    getZ() {}
});
let f1 = new Fn; */