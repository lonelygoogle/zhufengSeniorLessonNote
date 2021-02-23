// obj['name']  获取成员为name的属性值
// obj[name] 把name变量存储的值作为成员获取其属性值
// 对象的属性名
//  + 字符串
//  + Symbol
//  + 数字/布尔/null/undefined等基本数据类型值(用这些值直接处理和基于他们的字符串格式处理结果是一样的)
// 也有人认为属性名除了Symbol只能是字符串格式的
// 对于普通对象来讲，属性名不能是引用数据类型值（比如对象），设置为对象，也会转换为字符串；ES6中新增Map数据结构，这个结构中可以允许属性名是一个对象；
/* var obj = {
    name: 'xxx',
    0: 100,
    true: 11
};
obj[Symbol('AA')] = 100;
var o1 = {
    name: 'xxx'
};
obj[o1] = 100; // obj["[object Object]"]=100
console.log(obj);  */

/* //example 1
var a = {},
    b = '0',
    c = 0;
a[b] = '珠峰'; // a['0']='珠峰'
a[c] = '培训'; // a[0]='培训'
console.log(a[b]); // => a['0'] '培训'

//example 2
var a = {},
    b = Symbol('1'),
    c = Symbol('1'); // b!==c 唯一值
a[b] = '珠峰';
a[c] = '培训';
console.log(a[b]); //=>'珠峰'

//example 3
var a = {},
    b = {
        n: '1'
    },
    c = {
        m: '2'
    };
a[b] = '珠峰'; // a["[object Object]"]='珠峰'
a[c] = '培训'; // a["[object Object]"]='培训'
console.log(a[b]); //=>a["[object Object]"]  '培训' */

//===========

/* var a = {
    n: 1
};
var b = a;
a.x = a = {
    n: 2
};
console.log(a.x);
console.log(b); */

//==========
// “在全局上下文中”，基于“var/function”声明的全局变量，也会给GO(window)中新增一个对应的私有属性，并且和全局的变量有“映射机制”：一个修改，另外一个也会跟着修改
/* var a = 10; // 1.声明一个全局变量a=10   2.给window新增一个私有属性 window.a=10
console.log(a); //首先看a是否为全局变量，如果是按照全局变量处理，如果不是全局变量，再看是否为window的一个属性，如果也不是window的属性则报错：a is not defined
console.log(window.a); //直接访问对象的成员

window.a = 20; //“映射机制” 全局变量a=20
console.log(a); */

/* // 基于“let/const”声明的全局变量和window没有关系
let a = 10; //全局变量a
console.log(a); //10
console.log(window.a); //undefined */

// 在全局上下文中
// a = 10; //不是全局变量，window.a=10，相当于省略了window（前提：确定之前没有声明过）

// 带声明的关键词和不带是不一样的机制，所以真实项目中请大家不要省略

/* var a = {
    n:1
}

var b = a
a.x = a = {
    n:2
}  // =>  a.x = {n:2}先算 .的优先级高
console.log(a.x)
console.log(b) */