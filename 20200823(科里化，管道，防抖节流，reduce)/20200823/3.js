/*
 * JS高阶函数：柯里化函数
 *   + 预处理思想 
 *   + 应用的也是闭包的机制
 */
/* function fn(a, ...args) {
    // ES6中的剩余运算符: ...args，把传递进来的实参获取到（排除基于其他形参获取的信息）
    console.log(args); //数组集合
    console.log(arguments); //类数组集合
    return function anonymous() {

    };
}
 */

// 柯里化函数：第一次执行大函数，形成一个闭包（原因：返回一个小函数），把一些信息存储到闭包中（传递的实参信息或当前闭包中声明的一些私有变量等信息）；等到后面需要把返回的小函数anonymous执行，遇到一些非自己私有变量，则向其上级上下文中中查找（也就是把之前存储在闭包中的信息获取到）；
function fn(...outerArgs) {
    // outerArgs存放第一次执行fn传递的实参信息 [1,2]

    return function anonymous(...innerArgs) {
        // innerArgs存放第二次执行匿名函数传递的实参信息 [3]

        let arr = outerArgs.concat(innerArgs);
        // let arr=[1,2,3];
        return arr.reduce(function (total, item) {
            return total + item;
        });
    };
}

let res = fn(1, 2)(3);
console.log(res); //=>6  1+2+3

/* 
 * reduce：数组中用来迭代遍历每一项的，可以把每一次处理的结果都拿到，在第一次的处理基础上，进行二次处理...直到数组遍历完成
 *   arr.reduce(function([result],[item]){
 *       // [result]
 *       //    + 和callback的同级级别中
 *       //    + 如果传递了[value]值，则第一次执行callback，里面的[result]存储的参数新信息;
 *   }[,value]);同时itme迭代的是数组中的第一项
 */
/* let arr = [10, 20, 30, 40, 50]
arr.reduce(function (result, item) {
    console.log(result, item); // result=0 item=10（数组第一项）
}, 0);

arr.reduce(function (result, item) {
    console.log(result, item); // result=10 item=20（数组第一项/第二项）
}); */

/* let arr = [10, 20, 30, 40, 50];
let n = arr.reduce(function (result, item) {
    // 把当前callback执行返回的结果，做为下一次迭代中的[result]处理
    return result + item;
}, 0);
console.log(n); */

// 自己实现reduce
/* function reduce(arr, callback, init) {
    // 进来后先把原始数组克隆一份（浅克隆）
    arr = arr.slice(0);

    // 校验init是否传递
    if (typeof init === "undefined") {
        init = arr[0];
        arr = arr.slice(1);
    }

    // 依次循环数组中的每一项
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i],
            index = i;
        init = callback(init, item, index);
    }

    return init;
} */

function reduce(arr, callback, init) {
    arr = arr.slice(0);
    let result = init;
    for (let i = 0; i < arr.length; i++) {
        if (init === undefined && i === 0) {
            // init没有传递值（只有第一轮特殊）
            result = arr[0];
            let item = arr[1],
                index = 1;
            if (!item) return result;
            result = callback(result, item, index);
            i++;
            continue;
        }
        // init传递值了
        let item = arr[i],
            index = i;
        result = callback(result, item, index);
    }
    return result;
}

// let arr = [10, 20, 30, 40, 50];

// let result = reduce(arr, function (result, item, index) {
//     console.log(index);
//     return result + item;
// });
// console.log(result);

// result = reduce(arr, function (result, item, index) {
//     console.log(index);
//     return result + item;
// }, 100);
// console.log(result);

