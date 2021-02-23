/* 
 * 发布订阅
 */
(function () {
    function Sub() {
        this.pond = {};
    }
    Sub.prototype = {
        constructor: Sub,
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
        },
        off(type, func) {
            let arr = this.pond[type] || [];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === func) {
                    arr[i] = null;
                    break;
                }
            }
        },
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
    };
    window.Sub = Sub;
})();

/*
 * 插件支持的配置信息(基于不同的配置信息，实现不同的功能)： 
 *   「调用一次插件，创建一套新的插件的结构，而关闭的时候，就是把这套结构移除掉」
 *    + title[string] 标题
 *    + template[string] 自定义的内容或者模板(基于ES6的模板字符串,拼接更丰富的内容结构)
 *    + buttons[array] 自定义按钮(组)
 *      [{text:'确定',click:[callback]},...]
 *    + modal[boolean] 控制遮罩层是否显示 默认是true
 *    + drag[boolean] 是否允许拖拽 默认是true
 *    ----------
 *    生命周期函数「当前操作的某个节点上，允许用户自定义处理的事情」
 *      -----回调函数
 *      + 打开 onopen
 *      + 关闭 onclose
 *      -----发布订阅
 *      + 拖拽开始 ondragstart
 *      + 拖拽中 ondraging
 *      + 拖拽结束 ondragend
 */
(function () {
    function ModalPlugin(options) {
        // CALL继承:继承父类私有的
        Sub.call(this);

        this.options = options;
        this.$drag_modal = null;
        this.$drag_content = null;
        this.$drag_head = null;
        this.x = 0;
        this.y = 0;
        this.l = 0;
        this.t = 0;

        this.init();
    }
    // 继承父类
    // m.__proto__ -> {}.__proto__ -> Sub.prototype
    ModalPlugin.prototype = Object.create(Sub.prototype);
    ModalPlugin.prototype = Object.assign(ModalPlugin.prototype, {
        constructor: ModalPlugin,
        version: '1.0.0',
        createDOM() {
            let frag = document.createDocumentFragment(),
                {
                    modal,
                    title,
                    template,
                    buttons
                } = this.options;
            if (modal) {
                this.$drag_modal = document.createElement('div');
                this.$drag_modal.className = 'drag_modal';
                frag.appendChild(this.$drag_modal);
            }
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

            // 开始动画：刷新一下浏览器的渲染队列
            this.$drag_modal.offsetHeight;
            this.$drag_modal.style.opacity = 1;
            this.$drag_content.style.opacity = 1;

            // 触发打开的回调函数
            this.options.onopen.call(this, this);
        },
        close() {
            if (this.$drag_modal) {
                this.$drag_modal.style.opacity = 0;
                this.$drag_modal.ontransitionend = () => {
                    document.body.removeChild(this.$drag_modal);
                    this.$drag_modal.ontransitionend = null;
                };
            }
            if (this.$drag_content) {
                this.$drag_content.style.opacity = 0;
                this.$drag_content.ontransitionend = () => {
                    document.body.removeChild(this.$drag_content);
                    this.$drag_content.ontransitionend = null;
                };
            }

            // 触发关闭的回调函数
            this.options.onclose.call(this, this);
        },
        // 实现拖拽
        down(ev) {
            let obj = this.$drag_content.getBoundingClientRect();
            this.x = ev.clientX;
            this.y = ev.clientY;
            this.l = obj.left;
            this.t = obj.top;
            window.onmousemove = this.move.bind(this);
            window.onmouseup = this.up.bind(this);

            // 基于发布订阅管理周期函数
            this.fire('ondragstart', this);
        },
        move(ev) {
            let curL = ev.clientX - this.x + this.l,
                curT = ev.clientY - this.y + this.t;
            let minL = 0,
                minT = 0,
                maxL = document.documentElement.clientWidth - this.$drag_content.offsetWidth,
                maxT = document.documentElement.clientHeight - this.$drag_content.offsetHeight;
            curL = curL < minL ? minL : (curL > maxL ? maxL : curL);
            curT = curT < minT ? minT : (curT > maxT ? maxT : curT);
            this.$drag_content.style.transform = 'translate(0,0)';
            this.$drag_content.style.left = `${curL}px`;
            this.$drag_content.style.top = `${curT}px`;

            // 基于发布订阅管理周期函数
            this.fire('ondraging', this);
        },
        up() {
            window.onmousemove = null;
            window.onmouseup = null;

            // 基于发布订阅管理周期函数
            this.fire('ondragend', this);
        },
        init() {
            this.createDOM();

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

            // 实现拖拽效果
            if (this.options.drag) {
                this.$drag_head = this.$drag_content ? this.$drag_content.querySelector('.drag_head') : null;
                if (this.$drag_head) {
                    this.$drag_head.style.cursor = 'move';
                    this.$drag_head.onmousedown = this.down.bind(this);
                }
            }
        }
    });

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
        onopen: {
            type: 'function',
            default: () => {}
        },
        onclose: {
            type: 'function',
            default: Function.prototype
        }
    };

    function proxy(options = {}) {
        // 参数处理:格式校验 && 合并默认值
        if (!isObject(options)) throw new TypeError('options must be an object!');
        let params = {};
        Object.keys(props).forEach(key => {
            let {
                type,
                default: defaultVal,
                required = false
            } = props[key];
            let val = options[key];
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