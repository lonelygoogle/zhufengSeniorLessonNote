/*
 * async/await：ES7中新提供的语法糖 
 *   + async修饰一个函数：保证函数返回的是一个promise实例
 *     + 和then很相似，函数执行不报错，返回成功的promise实例，报错返回的是失败的
 *     + return的值或者报错的原因就是promise实例的结果
 *     + 如果return的是一个新的promise实例，则新实例的结果影响返回promise的结果
 * 
 *   + async最常见的应用，是为了修饰函数，让函数中可以使用await（想要使用await，所在的函数必须是基于async修饰的）
 *   
 *   + await [promise实例]  等待promise实例状态为成功过的时候，再继续执行await下面的代码
 */

/* async function func() {
    return 10;
}
console.log(func()); */

/* function fn() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('异步处理完成');
            resolve('OK');
        }, 1000);
    });
} */

/* function func() {
    await fn(); //Uncaught SyntaxError: await is only valid in async function
} */
/* async function func() {
    let result = await fn();
    console.log('AAA', result); //result就是promise实例成功的后的结果
}
func();
     */

/* (async function () {
    let x = await 10;
    console.log(x); //10

    let y = await Promise.resolve(20);
    console.log(y); //20

    try {
        let z = await Promise.reject(30); //await后面的promise如果是失败的，则当前函数中await下面的代码都不会执行
        console.log(z);
    } catch (err) {
        // 基于try catch异常捕获，可以捕获到await后面的promise实例是失败状态下的失败信息(浏览器控制台不会再报错了)
        console.log(err); //30
    }
})(); */


/* async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}
console.log('script start');
setTimeout(function () {
    console.log('setTimeout');
}, 0)
async1();
new Promise(function (resolve) {
    console.log('promise1');
    resolve();
}).then(function () {
    console.log('promise2');
});
console.log('script end'); */

/* (async function () {
    await 10; //遇到await下面代码先放置在微任务队列中
    console.log('10'); //2
})();
console.log('OK'); //1 */

/* (async function () {
    await 10;
    console.log(10);

    await 20;
    console.log(20);
})();
console.log('OK'); //1 */


function func1() {
    console.log('func1 start');
    return new Promise(resolve => {
        resolve('OK');
    });
}

function func2() {
    console.log('func2 start');
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('OK');
        }, 10);
    });
}

console.log(1);
setTimeout(async () => {
    console.log(2);
    await func1();
    console.log(3);
}, 20);
for (let i = 0; i < 90000000; i++) {} //循环大约要进行80MS左右
console.log(4);
func1().then(result => {
    console.log(5);
});
func2().then(result => {
    console.log(6);
});
setTimeout(() => {
    console.log(7);
}, 0);
console.log(8);