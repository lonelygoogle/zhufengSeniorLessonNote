(function () {
    // 构造函数
    function MyPromise(executor) {
        if (typeof executor !== "function") throw new TypeError('MyPromise resolver undefined is not a function');

        // 每一个MyPromise实例应该具备这几个属性
        this.MyPromiseState = "pending";
        this.MyPromiseValue = undefined;
        this.resolveFunc = function () {};
        this.rejectFunc = function () {};

        // 修改它的状态/值，并且通知指定的方法执行
        var _this = this;
        var change = function change(state, value) {
            if (_this.MyPromiseState !== "pending") return;
            _this.MyPromiseState = state;
            _this.MyPromiseValue = value;
            setTimeout(function () {
                state === "fulfilled" ?
                    _this.resolveFunc(_this.MyPromiseValue) :
                    _this.rejectFunc(_this.MyPromiseValue);
            }, 0);
        };
        var resolve = function resolve(result) {
            change('fulfilled', result);
        };
        var reject = function reject(reason) {
            change('rejected', reason);
        };

        try {
            executor(resolve, reject);
        } catch (err) {
            change('rejected', err);
        }
    }

    // 构造函数原型
    MyPromise.prototype = {
        constructor: MyPromise,
        then: function (resolveFunc, rejectFunc) {
            var _this = this;
            // 参数不传递：顺延
            if (typeof resolveFunc !== "function") {
                resolveFunc = function resolveFunc(result) {
                    return MyPromise.resolve(result);
                };
            }
            if (typeof rejectFunc !== "function") {
                rejectFunc = function rejectFunc(reason) {
                    return MyPromise.reject(reason);
                };
            }
            // 每一次执行THEN方法都会返回一个新的MyPromise实例
            //   + resolve/reject 是控制新返回实例的成功和失败的
            //   + 把传递进来的需要执行的A:resolveFunc/B:rejectFunc进行包装处理
            return new MyPromise(function (resolve, reject) {
                _this.resolveFunc = function (result) {
                    try {
                        // 执行不报错，则新返回的实例是成功的（特殊：方法返回的是一个新的MyPromise实例，则新实例的状态和结果决定返回实例的状态和结果）
                        var x = resolveFunc(result);
                        x instanceof MyPromise ?
                            x.then(resolve, reject) :
                            resolve(x);
                    } catch (err) {
                        // 执行报错，则新返回的实例是失败的
                        reject(err);
                    }
                };
                _this.rejectFunc = function (reason) {
                    try {
                        var x = rejectFunc(reason);
                        x instanceof MyPromise ?
                            x.then(resolve, reject) :
                            resolve(x);
                    } catch (err) {
                        reject(err);
                    }
                };
            });
        },
        catch: function (rejectFunc) {
            // xxx.catch([function]) => xxx.then(null,[function])
            return this.then(null, rejectFunc);
        }
    };

    // 普通对象
    MyPromise.resolve = function resolve(result) {
        return new MyPromise(function (resolve) {
            resolve(result);
        });
    };
    MyPromise.reject = function reject(reason) {
        return new MyPromise(function (_, reject) {
            reject(reason);
        });
    };
    MyPromise.all = function all(promiseArr) {
        var _this = this;
        return new MyPromise(function (resolve, reject) {
            var index = 0, //记数
                results = []; //结果集合

            // 都成功后控制返回的实例也是成功
            var fire = function () {
                if (index >= promiseArr.length) {
                    resolve(results);
                }
            };

            // 循环依次处理每一个实例
            for (var i = 0; i < promiseArr.length; i++) {
                // 基于闭包机制存放每一轮循环的索引
                (function (i) {
                    var item = promiseArr[i];
                    if (!(item instanceof MyPromise)) {
                        results[i] = item;
                        index++;
                        fire();
                        return;
                    }
                    item.then(function (result) {
                        results[i] = result;
                        index++;
                        fire();
                    }).catch(function (reason) {
                        // 只要有一个是失败的，整体都是失败的
                        reject(reason);
                    });
                })(i);
            }
        });
    };

    // 让其支持浏览器导入和CommonJS/ES6Module模块导入规范
    if (typeof window !== "undefined") {
        window.MyPromise = MyPromise;
    }
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = MyPromise;
    }
})();


function fn1() {
    return MyPromise.resolve(10);
}

function fn2() {
    return MyPromise.reject(20);
}

function fn3() {
    return new MyPromise(resolve => {
        setTimeout(() => {
            resolve(30);
        }, 1000);
    });
}

// MyPromise.all返回的也是MyPromise实例p
//   + 数组中的每个MyPromise实例都是成功的，最后p才是成功的
//   + 数组中只要有一个实例是失败的，最后p都是失败的
//   + 如果最后都是成功，p的MyPromiseValue存储的也是一个数组：按照之前存放MyPromise实例的顺序，存储每一个实例的结果
var p = MyPromise.all([fn3(), fn1(), 40]);
p.then(function (result) {
    console.log(`P成功${result}`);
}).catch(function (reason) {
    console.log(`P失败${reason}`);
});
console.log(p)


//=======
/* 
var p1 = new MyPromise(function (resolve, reject) {
    resolve('OK');
    // reject('NO');
});
var p2 = p1.then(function (result) {
    console.log(`P1成功${result}`);
    return MyPromise.reject('P1 OK');
}, function (reason) {
    console.log(`P1失败${reason}`);
    return 'P1 NO';
});

p2.then(function (result) {
    console.log(`P2成功${result}`);
    return 'P2 OK';
}, function (reason) {
    console.log(`P2失败${reason}`);
    return 'P2 NO';
}); */


/* p1.then(null
    /!*function (result) {
         MyPromise.resolve(result);
    }*!/
    ,
    null
    /!*function (reason) {
        return MyPromise.reject(reason);
    }*!/
); */