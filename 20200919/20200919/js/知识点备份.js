/* (function () {
    /!* 核心类 *!/
    function ModalPlugin() {
        return new ModalPlugin();
    }

    function Factory() {}

    ModalPlugin.prototype = {
        constructor: ModalPlugin,
        version: '1.0.0'
    };
    Factory.prototype = ModalPlugin.prototype;



    /!* 暴露API:支持浏览器直接导入和CommonJS/ES6Module规范 *!/
    if (typeof window !== "undefined") {
        window.M = window.ModalPlugin = ModalPlugin;
    }
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = ModalPlugin;
    }
})(); */

/* 
function proxy(options = {}) {
    // 参数处理:格式校验 && 合并默认值
    if (!isObject(options)) throw new TypeError('options must be an object!');
    options = Object.assign({
        title: '系统温馨提示',
        template: '',
        buttons: [],
        modal: true,
        drag: true,
        opened: true
    }, options);

    return new ModalPlugin();
} */

(function () {
    class Sub {
        // 实例私有属性:自定义事件池
        pond = {};
        // 原型
        on(type, func) {
            let pond = this.pond;
            !pond.hasOwnProperty(type) ? pond[type] = [] : null;
            let arr = pond[type];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === func) {
                    return;
                }
            }
            arr.push(func);
        }
        off(type, func) {
            let arr = this.pond[type] || [];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === func) {
                    arr[i] = null;
                    break;
                }
            }
        }
        fire(type, ...params) {
            let arr = this.pond[type] || [];
            for (let i = 0; i < arr.length; i++) {
                let item = arr[i];
                if (typeof item === "function") {
                    item.call(this, ...params);
                    continue;
                }
                arr.splice(i, 1);
                i--;
            }
        }
    }
    window.Sub = Sub;
})();

function ModalPlugin(options) {
    this.options = options;
    this.$drag_modal = null;
    this.$drag_content = null;
    this.$drag_head = null;
    this.x = 0;
    this.y = 0;
    this.l = 0;
    this.t = 0;
    // // 创建一个发布订阅类的实例：this.sub.on/fire(...)
    // this.sub = new Sub;
    this.init();
}