/* ES6中基于Class创建类和实例 */
class Modal {
    // 构造函数 
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    // this.n = 100; ES7中在构造函数外这样写，等价于构造函数体中给实例设置的私有属性
    n = 100;

    // 原型上的“公共方法”（公共属性无法直接设置）
    // getX:()=>{} 原生的ES是不支持的，但是再react中，可以基于babel-preset-react-app语法包识别解析
    getX() {}
    getY() {}

    // 把其当作普通对象设置“静态”属性和方法
    static n = 200;
    static setNumber() {}
}
// 原型上的公共属性需要提取到外面单独的写
Modal.prototype.z = 10;

let m = new Modal(10, 20);
console.log(m);

// Modal();
// Uncaught TypeError: Class constructor Modal cannot be invoked without 'new'
// class创建的类不能作为普通函数执行的


/* function Modal(x, y) {
    this.x = x;
    this.y = y;
    this.n = 100;
}
Modal.prototype.z = 10;
Modal.prototype.getX = function () {
    console.log(this.x);
}
Modal.prototype.getY = function () {
    console.log(this.y);
}
// 把Modal当作普通的对象设置的私有属性方法：和实例没关系  Modal.xxx
Modal.n = 200;
Modal.setNumber = function (n) {
    this.n = n;
};
let m = new Model(10, 20); */