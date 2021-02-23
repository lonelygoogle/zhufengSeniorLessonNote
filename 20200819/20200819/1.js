// /*
//  * EC(G)
//  *   VO(G)
//  *      a = 12
//  *      b = 13 / undefined
//  *      c = 14 / 200
//  *      fn = 0x000000  [[scope]]:EC(G)
//  *   变量提升: var a; var b; var c; function fn(){...};
//  */
// console.log(a, b, c); // undefined * 3
// var a = 12,
//     b = 13,
//     c = 14;
// function fn(a) {
//     /*
//      * EC(FN)
//      *   AO(FN)
//      *      a = 10 / 100
//      *   作用域链:<EC(FN),EC(G)>
//      *   形参赋值:a=10
//      *   变量提升:--
//      */
//     console.log(a, b, c); // 10 13 14
//     a = 100;
//     c = 200;
//     console.log(a, b, c); // 100 13 200
// }
// b = fn(10); //函数执行没有返回结果(RETURN)
// console.log(a, b, c); // 12 undefined 200


/* var i = 0;
function A() {
    var i = 10;
    function x() {
        console.log(i);
    }
    return x;
}
var y = A();
y();
function B() {
    var i = 20;
    y();
}
B(); */


//===============
// /*
//  * EC(G)
//  *   a = 1 
//  *   obj = 0x000000
//  *   fn = 0x000001  [[scope]]:EC(G)
//  */
// var a = 1;
// var obj = {
//     name: "tom" // "jack"
// };

// function fn() {
//     /*
//      * EC(FN)
//            a2 = 全局a的值1
//      *   作用域链:<EC(FN),EC(G)>
//      */
//     var a2 = a;
//     obj2 = obj; //即不是私有的，也不是全局的，则此处相当于 window.obj2=0x000000(全局的obj)
//     a2 = a;
//     obj2.name = "jack"; //把window.obj2中的name修改（全局的obj也是这个堆）
// }
// fn();
// console.log(a); //=>1
// console.log(obj); //=>{name:'jack'}

//===============
// /*
//  * EC(G)
//  *   a = 1
//  *   fn = 0x000000 [[scope]]:EC(G) 
//  */
// var a = 1;
// function fn(a) {
//     /*
//      * EC(FN)
//      *   a = 1  
//      *     = 0x000001  [[scope]]:EC(FN)
//      *     = 2
//      * 
//      *   作用域链:<EC(FN),EC(G)> 
//      *   形参赋值:a=1
//      *   变量提升:
//      *      var a;
//      *      function a(){}; 不需要重新声明，但是需要重新赋值
//      */
//     console.log(a); //=>函数
//     var a = 2; // a=2还没处理过呢，在把私有变量a的值赋值为2
//     function a() {} //它不处理了，变量提升阶段都处理完了
//     console.log(a); //=>2
// }
// fn(a); //fn(1)
// console.log(a); //=>1

//===============
// /*
//  * EC(G) 
//  *   a = 12
//  *   fn = 0x000000  [[scope]]:EC(G)
//  */
// console.log(a); // =>undefined
// var a=12; 
// function fn(){
//     /*
//      * EC(FN)
//      *   a = 13
//      *  
//      *   作用域链:<EC(FN),EC(G)>
//      *   形参赋值:--
//      *   变量提升:var a; 
//      */
//     console.log(a); //=>undefined
//     var a=13;   
// }
// fn();   
// console.log(a); //=>12

// /*
//  * EC(G)
//  *   a  
//  *   fn = 0x000000 [[scope]]:EC(G) 
//  * 
//  *  变量提升:var a; function fn(){...}; 
//  */
// console.log(a); //=>undefined
// var a = 12; //全局的a=12
// function fn() {
//     /*
//      * EC(FN)
//      *   
//      *   作用域链:<EC(FN),EC(G)>
//      *   形参赋值:--
//      *   变量提升:-- 
//      */
//     console.log(a); //=>12
//     a = 13; //把全局的a=13
// }
// fn();
// console.log(a); //=>13

// /*
//  * EC(G)
//  *   fn = 0x000000 [[scope]]:EC(G) 
//  * 
//  *  变量提升:function fn(){...}; 
//  */
// console.log(a); //首先看是否为全局变量，不是，则再看是否为window的一个属性，如果还不是，报错：Uncaught ReferenceError: a is not defined  (这行代码一但报错，下面代码都不处理了)
// a=12;
// function fn(){
//     console.log(a);
//     a=13;   
// }
// fn();
// console.log(a);


//===============
// /*
//  * EC(G)
//  *  foo  
//  * 
//  *  变量提升：var foo; 
//  */
// var foo = 'hello'; //全局的foo='hello'
// (function (foo) {
//     /*
//      * EC(ANY)
//      *   foo = 'hello' 
//      *    
//      *   作用域链:<EC(ANY),EC(G)>
//      *   形参赋值:foo='hello' 
//      *   变量提升:var foo;
//      */
//     console.log(foo); //=>'hello'
//     // A||B：A的值是真，返回A的值，否则返回B的值
//     // A&&B：A的值是真，返回B的值，否则返回A的值
//     // 同时出现，&&优先级高于||
//     var foo = foo || 'world'; //foo='hello'
//     console.log(foo); //=>'hello'
// })(foo); //自执行函数执行，传递实参'hello'
// console.log(foo); //=>'hello'


//==============
// /*
//  * EC(G)
//  *  foo  
//  * 
//  *  变量提升:function foo;
//  */
// // debugger; 
// {
//     /*
//      * EC(BLOCK)
//      *   foo = 0x000000  
//      *       = 0x000001
//      * 
//      *   变量提升:
//      *      function foo(n){}
//      *      function foo(m) {}
//      */
//     function foo(n) {}  //把之前对foo的操作“映射”给全局  全局foo=0x000001
//     foo = 1;
//     function foo(m) {}  //一样要把之前对foo的操作“映射”给全局一份  全局foo=1
//     console.log(foo); //=>1
// }
// console.log(foo); //=>1

/*
 * EC(G)
 *   foo
 *    
 *   变量提升： function foo(n)  function foo(m)
 */
// {
//     /*
//      * EC(BLOCK)
//      *   foo = 0x000000  
//      *       = 0x000001
//      *   变量提升:
//      *     function foo(n){}
//      *     function foo(m){}
//      */
//     function foo(n) {}  //映射给全局 全局foo=0x000001
//     foo = 1;
//     function foo(m) {}  //映射给全局 全局foo=1
//     foo = 2; //私有的处理，和全局没关系了
//     console.log(foo); //=>2
// }
// console.log(foo); //=>1

//===============
/* var x=1;
function func(x,y=function anonymous1(){x=2}){
    x=3;
    y();
    console.log(x); // 2
}
func(5);
console.log(x); // 1 */

/* var x=1;
function func(x,y=function anonymous1(){x=2}){
    var x=3;
    y();
    console.log(x); // 3
}
func(5);
console.log(x); // 1 */

debugger;
var x=1;
function func(x,y=function anonymous1(){x=2}){
    /*
     * EC(FUNC) 私有函数上下文
     *     x = 5
     *     y = 0x000001 [[scope]]:EC(FUNC)   -> anonymous1
     * 
     *   作用域链:<EC(FUNC),EC(G)> 
     *   形参赋值:x=5 y=anonymous1...
     */
    /*
     * EC(BLOCK) 私有块级上下文 
     *     x = 5 / 3 / 4
     *     y = 0x000001 / 0x000002 [[scope]]:EC(BLOCK) -> anonymous2
     * 
     *   作用域链:<EC(BLOCK),EC(FUNC)>
     *   变量提升:var x; var y;
     *   代码执行:
     */
    var x=3;
    var y=function anonymous2(){
        /*
         * EC(Y)
         *   作用域链：<EC(Y),EC(BLOCK)>
         *   形参赋值:-- 
         *   变量提升:--
         */
        x=4; // x是上级上下文EC(BLOCK)
    };
    y(); //私有块级中的y，也就是anonymous2
    console.log(x); //=>4
}
func(5);
console.log(x); //=>1