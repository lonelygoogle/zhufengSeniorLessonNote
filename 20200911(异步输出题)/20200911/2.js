function MyPromise(executor) {
    // executor必须是一个可执行的函数
    if (typeof executor !== "function") throw new TypeError('MyPromise resolver undefined is not a function');

    // 每一个MyPromise实例应该具备这几个属性
    this.MyPromiseState = "pending";
    this.MyPromiseValue = undefined;
    this.resolveFunc = function () {};
    this.rejectFunc = function () {};

    // 修改它的状态/值，并且通知指定的方法执行
    var _this = this;
    var change = function change(state, value) {
        // 一但状态改变后，则不能再更改为其他状态了
        if (_this.MyPromiseState !== "pending") return;
        _this.MyPromiseState = state;
        _this.MyPromiseValue = value;
        // 更改状态和value是同步的，但是通知方法执行是异步的（所以必须要等到then执行完，方法放置好之后再通知方法执行）
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

    // executor执行报错,也会让实例的状态变为失败
    try {
        executor(resolve, reject);
    } catch (err) {
        // 失败的原因是报错信息
        change('rejected', err);
    }
}
MyPromise.prototype = {
    constructor: MyPromise,
    then: function then(resolveFunc, rejectFunc) {
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

        this.resolveFunc = resolveFunc;
        this.rejectFunc = rejectFunc;
    }
};
// 返回一个状态为成功的MyPromise实例
MyPromise.resolve = function resolve(result) {
    return new MyPromise(function (resolve) {
        resolve(result);
    });
};
// 返回一个状态为失败的MyPromise实例
MyPromise.reject = function reject(reason) {
    return new MyPromise(function (_, reject) {
        reject(reason);
    });
};

var p1 = new MyPromise(function (resolve, reject) {
    // resolve('OK');
    reject('NO');
});
p1.then(null
    /*function (result) {
         MyPromise.resolve(result);
    }*/
    ,
    null
    /*function (reason) {
        return MyPromise.reject(reason);
    }*/
);