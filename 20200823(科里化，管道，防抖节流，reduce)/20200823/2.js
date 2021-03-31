/*
 * JS高阶编程函数：惰性函数
 *   + 懒
 *   + 能执行一次的绝对不会执行第二次 
 */

// 这样编写，我们每一次执行方法都需要处理兼容：其实这种操作是没必要的，第一次执行已经知道兼容情况了，后期再执行方法（浏览器也没有刷新、也没有换浏览器）兼容校验是没必要处理的
/* function getCss(element, attr) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(element)[attr];
    }
    // IE6~8
    return element.currentStyle[attr];
} */

// 这是一种方案：页面一加载就把是否兼容处理了，后期执行方法直接基于变量的值判断使用哪个办法即可
/* let isCompatible = 'getComputedStyle' in window;
function getCss(element, attr) {
    if (isCompatible) {
        return window.getComputedStyle(element)[attr];
    }
    // IE6~8
    return element.currentStyle[attr];
} */

// 惰性思想来解决:函数重构
// + getCss是全局函数
// + 第一次执行方法会产生闭包
function getCss(element, attr) {
    /*
     * EC(1) 闭包
     *    element = BODY
     *    attr = 'width'
     *    作用域链:<EC(1),EC(G)>
     */
    if (window.getComputedStyle) {
        // 把全局的getCss重构成为具体的小函数
        getCss = function (element, attr) {
            return window.getComputedStyle(element)[attr];
        };
    } else {
        getCss = function (element, attr) {
            return element.currentStyle[attr];
        };
    }
    // 重构后首先执行一次：确保第一次调用getCss也可以获取到自己想要的结果
    return getCss(element, attr);
}

console.log(getCss(document.body, 'width'));
console.log(getCss(document.body, 'padding'));
// 第二次执行：执行是的重构后的小函数，这样告别了兼容校验的操作
console.log(getCss(document.body, 'margin'));