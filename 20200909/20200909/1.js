/* arr.forEach(function (item, index) {
    // 传递的匿名函数就是回调函数
});

Array.prototype.forEach = function forEach(callback) {
    // this -> arr
    for (let i = 0; i < this.length; i++) {
        let item = this[i],
            index = i;
        callback && callback.call(item, item, index);
    }
}; */

// 需求：基于JQ中提供的$.ajax从服务器获取数据(异步编程)
//   '/api/info'  获取个人信息 {id:xxx,name:xxx,...}
//   '/api/score?id=xxx'  根据个人ID获取他的分数信息  {chinese:98,math:99,...}
//   '/api/paiming?val=98'  根据分数，获取他在全年级的排名  {pai:2}
// 三个请求相互之间是有依赖的，上一个请求完成，才能执行下一个请求 “AJAX串行”

// 回调地狱
/* let data = {};
$.ajax({
    url: '/api/info',
    success: function (result) {
        // 获取数据成功后执行回调函数
        // result就是从服务器获取的结果
        data = result;

        $.ajax({
            url: `/api/score?id=${data.id}`,
            success: function (result) {

                $.ajax({
                    url: `/api/paiming?val=${result.chinese}`,
                    success: function (result) {
                
                    }
                });
            }
        });
    }
}); */

function queryInfo() {
    return new Promise(resolve => {
        $.ajax({
            url: '/api/info',
            success: function (result) {
                resolve(result);
            }
        });
    });
}

function queryScore(id) {
    return new Promise(resolve => {
        $.ajax({
            url: `/api/score?id=${id}`,
            success: function (result) {
                resolve(result);
            }
        });
    });
}

function queryPaiMing(val) {
    return new Promise(resolve => {
        $.ajax({
            url: `/api/paiming?val=${val}`,
            success: function (result) {
                resolve(result);
            }
        });
    });
}

// 基于Promise解决回调地狱
queryInfo().then(result => {
    return queryScore(result.id);
}).then(result => {
    return queryPaiMing(result.chinese);
}).then(result => {
    // 获取的排名信息
});

// 基于async/await看起来更舒服一些
(async function () {
    let result = await queryInfo();
    result = await queryScore(result.id);
    result = await queryPaiMing(result.chinese);
    // 获取的排名信息
})();