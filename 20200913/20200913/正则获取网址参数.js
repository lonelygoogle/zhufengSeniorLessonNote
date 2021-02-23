// 使用自执行函数形成闭包，防止污染全局变量
(function (){
    /* 
    *  queryURLParams: 获取网址url问号后面的参数信息(可能包括hash值)
    *  @params
    *  @return
    *    [object]把问号后面的信息以键值对的形式保存下来
    *    by Evan Huang  2020-09-18
    */
     function queryURLParams() {
        let obj = {}
        // 使用[]里面的^字符表示除去=?#&这几个的字符都能匹配，用[]外面的+表示一个或者多个
        this.replace(/([^=?#&]+)=([^=?#&]+)/g, (...[,$1,$2]) => obj[$1]=$2)
        this.replace(/#([^^=?#&]+)/g, (...[,$1]) => obj['HASH']=$1) 
        return obj
    }

    /* 
    *  milimeter: 实现大数字的千分符处理
    *  @params
    *  @return
    *    [string] 返回千分符
    *    by Evan Huang  2020-09-18
    */
    function milimeter () {
        return this.replace(/\d{1,3}(?=(\d{3})+$)/g, content=> content + ',')
    }
    // 用循环的形式将多个函数一次性存在String原型上，方便以后扩展
    ['queryURLParams','milimeter'].forEach((item) => {
        String.prototype[item] = eval(item)
    })
})()

// let url = 'www.baidu.com?lx=1&id=3#picture'
// console.log(url.queryURLParams())

let num = '492384934893'
console.log(num.milimeter())