/*
 * 插件支持的配置信息(基于不同的配置信息，实现不同的功能)： 
 *   「调用一次插件，创建一套新的插件的结构，而关闭的时候，就是把这套结构移除掉」
 *    + title[string] 标题
 *    + template[string] 自定义的内容或者模板(基于ES6的模板字符串,拼接更丰富的内容结构)
 *    + buttons[array] 自定义按钮(组)
 *      [{text:'确定',click:[callback]},...]
 *    + modal[boolean] 控制遮罩层是否显示 默认是true
 *    + drag[boolean] 是否允许拖拽 默认是true
 *    + opened[boolean] 方法一执行，当前的弹出框是显示还是隐藏的 默认true，显示的
 *    ----------
 *    生命周期函数「当前操作的某个节点上，允许用户自定义处理的事情」
 *      + 打开 onopen
 *      + 关闭 onclose
 *      + 拖拽开始 ondragstart
 *      + 拖拽中 ondraging
 *      + 拖拽结束 ondragend
 */
(function () {
    /* 核心类 */
    function ModalPlugin(options) {
        // 把配置项挂在到实例上
        this.options = options;
        this.$drag_modal = null;
        this.$drag_content = null;

        this.init();
    }
    ModalPlugin.prototype = {
        constructor: ModalPlugin,
        version: '1.0.0',
        // 创建DOM结构
        createDOM() {
            let frag = document.createDocumentFragment(),
                {
                    modal,
                    title,
                    template,
                    buttons
                } = this.options;

            // 创建遮罩层
            if (modal) {
                this.$drag_modal = document.createElement('div');
                this.$drag_modal.className = 'drag_modal';
                frag.appendChild(this.$drag_modal);
            }

            // 创建内容的结构
            this.$drag_content = document.createElement('div');
            this.$drag_content.className = 'drag_content';
            this.$drag_content.innerHTML = `
                <div class="drag_head">
                    ${title}
                    <a href="javascript:;" class="drag_close"></a>
                </div>
                <div class="drag_main">${template}</div>
                ${buttons.length>0?`<div class="drag_foot">
                    ${buttons.map((item,index)=>{
                        return `<a href="javascript:;" class="drag_button" index="${index}">
                            ${item.text}
                        </a>`;
                    }).join('')}
                </div>`:''}
            `;
            frag.appendChild(this.$drag_content);

            document.body.appendChild(frag);
        },
        // 控制显示隐藏 && 销毁
        open() {
            this.$drag_modal ? this.$drag_modal.style.display = 'block' : null;
            this.$drag_content ? this.$drag_content.style.display = 'block' : null;
        },
        close() {
            this.$drag_modal ? this.$drag_modal.style.display = 'none' : null;
            this.$drag_content ? this.$drag_content.style.display = 'none' : null;
        },
        destroy() {
            this.$drag_modal ? document.body.removeChild(this.$drag_modal) : null;
            this.$drag_content ? document.body.removeChild(this.$drag_content) : null;
        },
        // 入口:命令模式
        init() {
            this.createDOM();

            // 默认是显示的
            this.options.opened ? this.open() : null;

            // 基于事件委托实现点击处理：关闭按钮 & 自定义按钮
            if (this.$drag_content) {
                let _this = this;
                this.$drag_content.addEventListener('click', function (ev) {
                    let target = ev.target,
                        targetTag = target.tagName,
                        targetClass = target.className;

                    if (targetTag === 'A' && targetClass === "drag_close") {
                        // 关闭按钮
                        _this.close();
                        return;
                    }

                    if (targetTag === 'A' && targetClass === "drag_button") {
                        // 自定义按钮
                        let index = target.getAttribute('index'),
                            obj = _this.options.buttons[index];
                        if (!obj || (typeof obj.click !== "function")) return;
                        obj.click.call(_this, _this);
                        return;
                    }
                });
            }

        }
    };

    // 把一些内部用的方法扩展到ModalPlugin对象上，这样插件本身还具备了一定的类库特点
    const isObject = function isObject(value) {
        let class2type = {},
            type = class2type.toString.call(value);
        return /Object/.test(type);
    };
    const toType = function toType(value) {
        let class2type = {},
            type = class2type.toString.call(value);
        return /^\[object ([a-zA-Z]+)\]$/.exec(type)[1].toLowerCase();
    };
    ModalPlugin.isObject = isObject;
    ModalPlugin.toType = toType;

    /* 暴露API:支持浏览器直接导入和CommonJS/ES6Module规范 */
    // 技巧：在需要传递很多实参的情况下（一般两个以上认为多了），如果是基于设定形参的方式来处理，存在要严格管控传递顺序，以及很难给参数设定默认值等情况 =>基于对象的方式来管理传递的参数(忽略顺序/有效设定默认值)
    const props = {
        title: {
            type: 'string',
            default: '系统温馨提示'
        },
        template: {
            type: 'string',
            required: true
        },
        buttons: {
            type: 'array',
            default: []
        },
        modal: {
            type: 'boolean',
            default: true
        },
        drag: {
            type: 'boolean',
            default: true
        },
        opened: {
            type: 'boolean',
            default: true
        }
    };

    function proxy(options = {}) {
        // 参数处理:格式校验 && 合并默认值
        if (!isObject(options)) throw new TypeError('options must be an object!');
        let params = {};
        Object.keys(props).forEach(key => {
            // 拿到每一项的规则
            let {
                type,
                default: defaultVal,
                required = false
            } = props[key];
            // 拿到传递进来的信息值:如果没传递就是undefined
            let val = options[key];
            // 规则校验
            if (required && val === undefined) throw new TypeError(`${key} must be required!`);
            if (val !== undefined) {
                if (toType(val) !== type) throw new TypeError(`${key} must be an ${type}!`);
                params[key] = val;
                return;
            }
            params[key] = defaultVal;
        });
        return new ModalPlugin(params);
    }

    if (typeof window !== "undefined") {
        window.M = window.ModalPlugin = proxy;
    }
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = proxy;
    }
})();