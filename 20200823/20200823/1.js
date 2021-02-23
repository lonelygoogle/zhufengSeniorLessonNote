/* 终极处理方案：单例设计模式（原理：利用闭包的保护及对象的分组特征，结合在一起实现的） =>最早的模块化编程  */

// 单例：单独的实例，每一个实例都是独立开来的，里面有很多自己的私有属性和方法
// + 每一个对象都是Object的单独实例
//   + let obj={};  字面量方式
//   + let obj=new Object(); 构造函数方式
// + 命名空间：俗称“对象名”
//   + 分组特征
// let utils = {};
// let SearchModule = {};

// 工具库:大量公共的方法（有些方法是内部用的，有些是可以供外面调用的）
// let utils = (function () {
//     function getCss() {}
//     function setCss() {}
//     function css() {
//         getCss();
//         setCss();
//     }
//     return {
//         css
//     };
// })();

// // 搜索模块
// let SearchModule = (function () {
//     let keyword = "";
//     function handle() {}
//     function query() {}
//     utils.css();
//     return {
//         handle,
//         // init:function(){}
//         init() {
//             // 控制业务板块中我们先执行谁，再执行谁：控制业务逻辑处理顺序的 “命令模式”
//             query();
//             handle();
//         }
//     };
// })();
// SearchModule.init();

// // 资讯模块
// let NewsModule = (function () {
//     let data = [];
//     function query() {}
//     utils.css();
//     SearchModule.handle();
//     return {
//         init() {

//         }
//     };
// })();
// NewsModule.init();

//==============
// // 真实业务开发
// // A
// let AModule = (function () {
//     let step = 0;
//     function fn() {}
//     function query() {}
//     // 我们想把私有的东西暴露出去共外面调用（API）
//     // 1. window.xxx=xxx  瑕疵：不能给全局下暴露太多的方法，否则又出现“全局变量污染”
//     // window.query = query;

//     // 2. 基于返回对象（分组）的方法，把需要暴露的API，都放置到同一个空间下
//     return {
//         // query:query
//         query,
//         step
//     };
// })();

// // B
// (function () {
//     let step = 0;
//     function fn() {}
//     AModule.query();
// })();

//==============
// 为了防止“全局变量污染”
// 方案1:闭包/私有上下文  =>保护
// (function () {
//     let name = "欧阳发贵";
//     let age = 21;
//     let sex = '男';
//     let friends = ["马云", "马化腾"];
// })();

// (function () {
//     let name = "吴家乐";
//     let age = 91;
//     let sex = "你看着办";
//     let friends = ["周老师"];
// })();

// 方案2:对象 =>分组:把描述同一个事物的属性和方法都放置在相同的空间(堆内存)中
// let person1 = {
//     name: '欧阳发贵',
//     age: 21
// };

// let person2 = {
//     name: '吴家乐',
//     age: 91
// };

//==============
// 在没有对象和函数的情况下，我们编写代码，经常出现“全局变量污染”
// let name = "欧阳发贵";
// let age = 21;
// let sex = '男';
// let friends = ["马云", "马化腾"];

// let name = "吴家乐";
// let age = 91;
// let sex = "你看着办";
// let friends = ["周老师"];


//==================================================
// var A = typeof window !== "undefined" ? window : this;
// // 利用暂时性死区：一个未被声明的变量在typeof检测的时候不会报错，只是返回"undefined"
// // ->检测window是否存在
// // + JS在浏览器中执行：是存在window的（window===GO）
// // + JS在NODE中执行：不存在window，全局对象是global
// // ->A最后的结果根据执行所在的环境不一样，结果也不一样：
// // + 浏览器 window   
// // + NODE global
// var B = function (window, noGlobal) {
//     // 如果是在浏览器环境中执行的JS代码：
//     // + window : window
//     // + noGlobal : undefined

//     // 如果是NODE下执行
//     // + window : global
//     // + noGlobal : true

//     "use strict";
//     var jQuery = function (selector, context) {};

//     if (typeof noGlobal === "undefined") {
//         // 浏览器环境下:暴露给全局的两个变量，值都是私有的jQuery
//         // + jQuery
//         // + $
//         window.jQuery = window.$ = jQuery;
//     }

//     return jQuery;
// };

// (function (global, factory) {
//     "use strict";
//     // global:window / global
//     // factory:B

//     // 验证是否支持CommonJS/ES6Module规范（支持这个规范的是Node.js）
//     if (typeof module === "object" && typeof module.exports === "object") {
//         // 代码是运行在node环境下的（或者是基于webpack打包运行的项目）
//         module.exports = global.document ?
//             factory(global, true) :
//             function (w) {
//                 if (!w.document) {
//                     throw new Error("jQuery requires a window with a document");
//                 }
//                 return factory(w);
//             };
//     } else {
//         // 运行在浏览器或者webview(相当于浏览器)中
//         // => B(window)
//         factory(global);
//     }
// })(A, B);

// // $() ===> jQuery()

// =======
// 在我们自己编写类库/插件/UI组件/框架的时候，为了防止全局变量污染，我们需要基于闭包的机制进行“私有化”处理
// + 能够在浏览器中运行
// + 也能支持CommonJS或者ES6Module规范(node/webpack)
(function () {
    function Banner() {}

    // 浏览器环境
    if (typeof window !== "undefined") {
        window.Banner = Banner;
    }

    // 支持CommonJS/ES6Module
    if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
        module.exports = Banner;
    }
})();