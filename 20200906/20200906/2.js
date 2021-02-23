function anonymous(window, noGlobal) {
    /*
     * JQ的代码核心：jQuery既是一个普通函数、也是一个构造函数、也是一个普通的对象
     *    JQ中提供的方法  
     *       + jQuery.prototype「类」 供其实例调用的公共属性方法  $(...).xxx()
     *       + jQuery「对象」 这上面的方法是类库提供的工具类方法  $.xxx()
     * 
     *    JQ选择器获取的是JQ的一个实例：类数组集合（JQ对象）
     *       + $.makeArray
     */
    var version = "3.5.1",
        jQuery = function (selector, context) {
            return new jQuery.fn.init(selector, context);
        };

    // 构造函数
    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        jquery: version,
        get: function (num) {
            // 把JQ类数组集合变为数组集合(Array的实例)
            if (num == null) {
                return Array.prototype.slice.call(this);
            }
            // 支持负数索引
            return num < 0 ? this[num + this.length] : this[num];
        },
        eq: function (i) {
            var len = this.length,
                j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },
        // 传递一个数组，我们把其变为JQ实例
        pushStack: function (elems) {
            // this.constructor()：jQuery()，空集合(JQ实例)
            // 合并后的结果，既是一个JQ实例(集合)，也包含你传递进来的这些项的信息
            var ret = jQuery.merge(this.constructor(), elems);
            ret.prevObject = this;
            return ret;
        },
        each: function (callback) {
            // 调用原型上的each方法：核心本质也是调用工具类的each方法
            return jQuery.each(this, callback);
        },
        sort: [].sort
        //...
    };
    // $(...).sort(function(){})
    // [].sort.call($(...),function(){})

    // 让JQ集合(类数组)变为可别迭代的，这样可以基于for of循环遍历这个集合
    if (typeof Symbol === "function") {
        jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
    }

    // 扩展
    // $.extend({fn:funcion(){}}) 向对象上扩展方法，完善类库  ->$.fn()
    // $.fn.extend({fn:funcion(){}})) 向原型上扩展方法，编写JQ插件 ->$(...).fn()
    jQuery.extend = jQuery.fn.extend = function () {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // 如果第一个值传递的是布尔，让deep等于这个值，第二个值是我么需要扩展的对象
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !isFunction(target)) {
            target = {};
        }

        // Extend jQuery itself if only one argument is passed
        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {

            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {

                // Extend the base object
                for (name in options) {
                    copy = options[name];

                    // Prevent Object.prototype pollution
                    // Prevent never-ending loop
                    if (name === "__proto__" || target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (jQuery.isPlainObject(copy) ||
                            (copyIsArray = Array.isArray(copy)))) {
                        src = target[name];

                        // Ensure proper type for the source value
                        if (copyIsArray && !Array.isArray(src)) {
                            clone = [];
                        } else if (!copyIsArray && !jQuery.isPlainObject(src)) {
                            clone = {};
                        } else {
                            clone = src;
                        }
                        copyIsArray = false;

                        // Never move original objects, clone them
                        target[name] = jQuery.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    // $.each([10, 20, 30], function(i,item){
    //     // this -> 当前遍历这一项
    //     // i当前遍历这一项的索引  item当前遍历这一项
    //     if(item>20) return false;
    // });
    // $(...).each(function(){...})  => $.each($(...),function(i,item){...})
    jQuery.extend({
        // 遍历数组/类数组/对象
        each: function (obj, callback) {
            var length, i = 0;
            if (isArrayLike(obj)) {
                // 数组或者类数组基于for循环完成
                length = obj.length;
                for (; i < length; i++) {
                    var item = obj[i];
                    var res = callback.call(item, i, item);
                    //在内置forEach的基础上可以控制循环结束：只要回调函数中返回false，循环就可以结束了
                    if (res === false) {
                        break;
                    }
                }
            } else {
                // 如果是对象，基于for in循环
                for (i in obj) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            }
            return obj;
        }
    });

    // $(...)执行是创造了init这类的一个实例，实例.__proto__===init.prototype===jQuery.prototype，所以也可以说$(...)创造出来的是jQuery类的一个实例 =>“把jQuery当作普通函数执行，也可以创造它的一个实例「工厂模式」”
    var rootjQuery = jQuery(document);
    var init = jQuery.fn.init = function (selector, context, root) {
        var match, elem;
        // ""/null/undefined/false
        if (!selector) return this;
        root = root || rootjQuery;

        if (typeof selector === "string") {
            // 字符串
            //   + HTML结构字符串  创建一个DOM元素
            //   + 选择器字符串  获取页面中符合条件的元素
            /* if (selector[0] === "<" &&
                selector[selector.length - 1] === ">" &&
                selector.length >= 3) {} else {} */
            //...
        } else if (selector.nodeType) {
            // 原生DOM元素对象(JS内置方法获取的)：把DOM对象变为了一个类数组集合
            this[0] = selector;
            this.length = 1;
            return this;
        } else if (isFunction(selector)) {
            // 函数 $(function(){}) <==> $(document).ready(function(){})
            // 等待页面中DOM结构加载完成(DOMContentLoaded)触发回调函数函数执行，触发点优先于window.onload(DOM结构及页面中所有资源都加载完才会触发执行)
            return root.ready !== undefined ?
                root.ready(selector) :
                selector(jQuery);
        }

        // 创造一个类数组集合
        return jQuery.makeArray(selector, this);
    };
    init.prototype = jQuery.fn;

    // 防止多库共存“$冲突”：JQ转让$使用权的方法 
    var _jQuery = window.jQuery,
        _$ = window.$;
    jQuery.noConflict = function (deep) {
        if (window.$ === jQuery) {
            window.$ = _$;
        }
        if (deep && window.jQuery === jQuery) {
            window.jQuery = _jQuery;
        }
        return jQuery;
    };

    // 暴露到全局
    if (typeof noGlobal === "undefined") {
        window.jQuery = window.$ = jQuery;
    }
}

// $===jQuery===函数内部的jQuery
// JQ选择器就是把JQ方法执行 [selector]选择器  [context]上下文(默认:document)
// $([selector],[context])
// jQuery([selector],[context])

// 转让$使用权：导入JQ的时候，首先它会记录之前$的使用情况，存储到_$中；并且让$归为JQ；当执行noConflict的时候，把$的使用权回归_$，返回JQ，外部变量j是JQ新的代言人；
/*
 * <script src='zepto.min.js'>   Zepto使用的也是$
 *   $ -> Zepto
 * 
 * <script src='jquery.min.js'>  jQuery使用的也是$
 *   做了一些事情:
 *      + var _$=window.$   _$->Zepto
 *   $ -> jQuery
 * 
 * var j=$.noConflict() 转让了$使用权
 *   做了一些事情：
 *      + window.$ = _$
 *      + return jQuery
 *   $ -> Zepto
 *   j -> jQuery
 */

/* $(function () {
    // DOM结构加载完触发执行
    // JQ不论是在HEAD还是BODY末尾导入，都可以获取到DOM元素
}); */

/* 
 * 真实项目中，我们会遇到JQ对象(JQ实例/类数组集合)和原生DOM对象相互切换的过程 
 *   + JQ对象不能用原生内置的属性方法
 *   + 原生DOM对象也不能用JQ原型上的方法
 * 
 * 原生DOM->JQ对象
 *   + $(原生DOM)
 * 
 * JQ对象->原生DOM
 *   + JQ对象[索引]
 *   + JQ对象.get([索引])  上述两个都是获取原生DOM对象的
 *   + JQ对象.eq([索引])   获取的结果还是JQ对象(类数组集合/JQ新的实例)，里面存储一项：索引对应的
 */
// let body = document.body;
// console.dir(body);
// let $body = $(body);
// console.log($body);
// let $elements = $('*');


// 传递的值：数字、函数 或者 函数（数字不传递默认是0）
/* function fn() {
    var x = 0,
        y = arguments[0];
    if (typeof y === "number") {
        x = y;
        y = arguments[1];
    }
    console.log(x, y);
}
fn(0, function () {});
fn(function () {}); */

/* 
 * for of 循环
 *   + 可以被迭代的数据结构（拥有这个属性的 Symbol.iterator），可以基于for of循环处理 
 *     + 数组  Array.prototype[Symbol.iterator] = function values() { [native code] }
 *     + arguments   arguments[Symbol.iterator] = function values() { [native code] }
 *     + NodeList节点类数组集合
 *     + HTMLCollection元素集合
 *     + new Set()
 *     + new Map()
 *     + ...
 *   + 普通对象默认是不具备可迭代性的，因为它不具备 Symbol.iterator 这个属性
 */
/* let arr = [1, 2];
for (let item of arr) {
    console.log(item);
} */

/* let obj = {
    0: 1,
    1: 2,
    length: 2
};
for (let item of obj) { //Uncaught TypeError: obj is not iterable
    console.log(item);
} */

/* let obj = {
    0: 1,
    1: 2,
    length: 2,
    [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of obj) {
    console.log(item);
} */