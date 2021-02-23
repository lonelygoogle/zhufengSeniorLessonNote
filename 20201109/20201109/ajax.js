var _ = (function () {
    var getProto = Object.getPrototypeOf;
    var class2type = {};
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    var fnToString = hasOwn.toString;
    var ObjectFunctionString = fnToString.call(Object);

    [
        "Boolean",
        "Number",
        "String",
        "Symbol",
        "Function",
        "Array",
        "Date",
        "RegExp",
        "Object",
        "Error"
    ].forEach(function (name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

    function toType(obj) {
        if (obj == null) {
            return obj + "";
        }
        return typeof obj === "object" || typeof obj === "function" ?
            class2type[toString.call(obj)] || "object" :
            typeof obj;
    }

    function isPlainObject(obj) {
        var proto,
            Ctor,
            type = toType(obj);
        if (!obj || type !== "object") {
            return false;
        }
        proto = getProto(obj);
        if (!proto) {
            return true;
        }
        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    }

    function isEmptyObject(obj) {
        var keys = [
            ...Object.keys(obj),
            ...Object.getOwnPropertySymbols(obj)
        ];
        return keys.length === 0 ? true : false;
    }

    function isFunction(obj) {
        return typeof obj === "function" && typeof obj.nodeType !== "number";
    };

    function isWindow(obj) {
        return obj != null && obj === obj.window;
    };

    function isArrayLike(obj) {
        var length = !!obj && "length" in obj && obj.length,
            type = toType(obj);
        if (isFunction(obj) || isWindow(obj)) {
            return false;
        }
        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;
    }

    function shallowClone(obj) {
        let type = toType(obj),
            Ctor = obj.constructor;
        if (/^(symbol|bigint)$/i.test(type)) return Object(obj);
        if (/^(regexp|date)$/i.test(type)) return new Ctor(obj);
        if (/^error$/i.test(type)) return new Ctor(obj.message);
        /* if (/^function$/i.test(type)) {
            return function () {
                return obj.call(this, ...arguments);
            };
        } */
        if (/^(object|array)$/i.test(type)) {
            let keys = [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)],
                result = new Ctor();
            each(keys, (index, key) => {
                result[key] = obj[key];
            });
            return result;
        }
        return obj;
    }

    function deepClone(obj, cache = new Set()) {
        let type = toType(obj),
            Ctor = obj.constructor;
        if (!/^(object|array)$/i.test(type)) return shallowClone(obj);
        if (cache.has(obj)) return obj;
        cache.add(obj);
        let keys = [
                ...Object.keys(obj),
                ...Object.getOwnPropertySymbols(obj)
            ],
            result = new Ctor();
        each(keys, (index, key) => {
            result[key] = deepClone(obj[key], cache);
        });
        return result;
    }

    function merge(obj1, obj2) {
        obj1 != null ? obj1 = deepClone(obj1) : null;
        obj2 != null ? obj2 = deepClone(obj2) : null;
        let isPlain1 = isPlainObject(obj1),
            isPlain2 = isPlainObject(obj2);
        if (!isPlain1) return obj2;
        if (!isPlain2) return obj1;
        [
            ...Object.getOwnPropertyNames(obj2),
            ...Object.getOwnPropertySymbols(obj2)
        ].forEach(key => {
            obj1[key] = merge(obj1[key], obj2[key]);
        });
        return obj1;
    }

    function each(obj, callback) {
        var length, i = 0;
        if (isArrayLike(obj)) {
            length = obj.length;
            for (; i < length; i++) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        } else {
            var keys = [
                ...Object.getOwnPropertyNames(obj),
                ...Object.getOwnPropertySymbols(obj)
            ];
            for (; i < keys.length; i++) {
                var key = keys[i],
                    value = obj[key];
                if (callback.call(value, key, value) === false) {
                    break;
                }
            }
        }
        return obj;
    }

    return {
        toType,
        isPlainObject,
        isEmptyObject,
        isFunction,
        isWindow,
        isArrayLike,
        merge,
        each
    };
})();

/*
 * 基于Promise封装一个ajax库
 *   + 参考axios的部分处理方式
 *   + XMLHttpRequest
 * 
 * 基本语法：
 *   ajax([config])
 *   ajax(url,[config])
 *   ajax.get/head/options/delete([url],[config])
 *   ajax.post/put([url],[data],[config])
 *   ajax.all([promise array])
 * 
 * 二次配置：
 *   + 默认配置项
 *   + ajax.defaults.xxx 修改默认配置项
 *   + ajax([config]) 自己传递的配置项
 *   + ajax.create([config]) 创建新的实例
 * {
 *    baseURL:'',
 *    url:'',
 *    method:'get',
 *    transformRequest:function(data){return data;}, 请求主体传递信息的格式化
 *    headers:{
 *       common:{},
 *       get:{},
 *       ...
 *       'Content-Type':'application/json'
 *    },
 *    params:{},  URL传参数信息（拼接到URL的末尾）
 *    cache:true, GET系列请求中是否清除缓存（?_=随机数）
 *    data:{}, 请求主体传参信息
 *    timeout:0, 设置请求超时时间
 *    withCredentials:false, 跨域请求中允许携带资源凭证
 *    responseType:'json',  预设服务器返回结果的处理方案 'stream', 'document', 'json', 'text'
 *    validateStatus: function (status) {
 *       return status >= 200 && status < 300; // default
 *    }
 * }
 * 
 * 拦截器：
 *   InterceptorManager
 *   + 请求拦截器  ajax.interceptors.request.use(function(config){})
 *   + 响应拦截器  ajax.interceptors.response.use(function(response){},function(reason){})
 * 
 * 基于ajax请求回来的结果都是promise实例
 *   + response
 *     + data  响应主体信息
 *     + status 状态码
 *     + statusText 状态码的描述
 *     + headers 响应头信息
 *     + request XHR原生对象
 *   + reason
 *     + response
 *     + message
 *     + ...
 */
(function () {
    /* 发送请求核心内容 */
    function Ajax(config) {
        this.config = config;
        this.GETREG = /^(GET|HEAD|OPTIONS|DELETE)$/i;
        return this.send();
    }
    Ajax.prototype = {
        version: '1.0.0',
        constructor: Ajax,
        send() {
            let {
                method,
                validateStatus,
                timeout,
                withCredentials
            } = this.config;
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest;
                xhr.open(method, this.initURL());
                // 常规配置
                xhr.timeout = timeout;
                xhr.withCredentials = withCredentials;
                this.initHeaders(xhr);
                xhr.onreadystatechange = () => {
                    // 服务有响应
                    let {
                        readyState,
                        status
                    } = xhr;
                    if (!validateStatus(status)) {
                        // 状态码不符合要求：失败
                        reject(this.initResult(false, xhr));
                        return;
                    }
                    if (readyState === 4) {
                        // 成功
                        resolve(this.initResult(true, xhr));
                    }
                };
                xhr.onerror = error => {
                    // 服务器没有任何响应：返回的结果中是没有response对象的
                    reject({
                        message: error.message
                    });
                };
                xhr.send(this.initData());
            });
        },
        // 处理请求头
        initHeaders(xhr) {
            let {
                headers,
                method
            } = this.config;
            let alone = headers[method] || {},
                common = headers['common'] || {};
            delete headers['common'];
            _.each(['get', 'head', 'delete', 'options', 'post', 'put'], (index, item) => {
                delete headers[item];
            });
            common = _.merge(common, alone);
            headers = _.merge(headers, common);
            _.each(headers, (key, value) => {
                xhr.setRequestHeader(key, value);
            });
        },
        // 处理URL
        stringify(params) {
            let str = ``;
            _.each(params, (key, value) => {
                str += `&${key}=${value}`;
            });
            return str.substring(1);
        },
        initURL() {
            let {
                baseURL,
                url,
                method,
                params,
                cache
            } = this.config;
            url = baseURL + url;
            // GET请求下才处理问号传参 && 缓存
            if (this.GETREG.test(method)) {
                params = this.stringify(params);
                if (params) {
                    url += `${url.includes('?')?'&':'?'}${params}`;
                }
                if (!cache) {
                    url += `${url.includes('?')?'&':'?'}_=${Math.random()}`;
                }
            }
            return url;
        },
        // 处理DATA
        initData() {
            let {
                method,
                data,
                transformRequest
            } = this.config;
            if (this.GETREG.test(method)) return null;
            return transformRequest(data);
        },
        // 处理返回结果
        getHeaders(xhr) {
            let headersText = xhr.getAllResponseHeaders(),
                headers = {};
            headersText = headersText.split(/(?:\n)/g);
            _.each(headersText, (index, item) => {
                let [key, value] = item.split(': ');
                if (!key) return;
                headers[key] = value;
            });
            return headers;
        },
        initResult(flag, xhr) {
            let response = {
                data: {},
                request: xhr,
                status: xhr.status,
                statusText: xhr.statusText,
                headers: this.getHeaders(xhr),
                config: this.config
            };
            if (flag) {
                let text = xhr.responseText;
                switch (this.config.responseType.toLowerCase()) {
                    case 'json':
                        text = JSON.parse(text);
                        break;
                    case 'stream':
                        text = xhr.response;
                        break;
                    case 'document':
                        text = xhr.responseXML;
                        break;
                }
                response.data = text;
                return response;
            }
            return {
                response,
                message: xhr.statusText
            };
        }
    };

    /* 参数处理 */
    // 处理HEADERS默认值
    let headers = {
        common: {
            'Content-Type': 'application/json'
        }
    };
    _.each(['get', 'head', 'delete', 'options', 'post', 'put'], (index, item) => {
        headers[item] = {};
    });

    // 插件默认配置项及其规则
    let configDefault = {
        baseURL: {
            type: 'string',
            default: ''
        },
        url: {
            type: 'string',
            required: true
        },
        method: {
            type: 'string',
            default: 'get'
        },
        headers: {
            type: 'object',
            default: headers
        },
        params: {
            type: 'object',
            default: {}
        },
        cache: {
            type: 'boolean',
            default: true
        },
        data: {
            type: 'object',
            default: {}
        },
        timeout: {
            type: 'number',
            default: 0
        },
        withCredentials: {
            type: 'boolean',
            default: false
        },
        responseType: {
            type: 'string',
            default: 'json'
        },
        transformRequest: {
            type: 'function',
            default: function (data) {
                if (_.isEmptyObject(data)) return null;
                // 默认会把请求主体传递的DATA对象，变为JSON字符串传递给服务器
                return JSON.stringify(data);
            }
        },
        validateStatus: {
            type: 'function',
            default: function (status) {
                return status >= 200 && status < 300;
            }
        }
    };

    // 配置项初始化
    function initParams(config) {
        // 先把自定义配置项config和ajax.defaults二次配置项进行合并
        config = _.merge(ajax.defaults, config);
        // 把合并后的结果再次和插件默认配置项进行合并「同时校验规则」
        let params = {};
        _.each(configDefault, (key, rule) => {
            let {
                type,
                required,
                default: defaultValue
            } = rule;
            // 传递的配置中没有这一项：验证是否必传 && 走默认值
            if (!config.hasOwnProperty(key)) {
                if (required) throw new ReferenceError(`${key} is muse be required!`);
                params[key] = defaultValue;
                return;
            }
            // 传递的配置中有这一项：验证传递值的格式 && 合并
            if (_.toType(config[key]) !== type) throw new TypeError(`${key} is must be an ${type}!`);
            params[key] = _.merge(defaultValue, config[key]);
        });
        return params;
    }

    /* 暴露供外部调用的API */
    function ajax(url, config) {
        if (_.isPlainObject(url)) config = url;
        if (_.toType(url) === "string") {
            if (!_.isPlainObject(config)) config = {};
            config.url = url;
        }
        config = initParams(config);
        return new Ajax(config);
    }
    // 快捷方法
    _.each(['get', 'head', 'delete', 'options'], (index, item) => {
        ajax[item] = function (url, config) {
            if (!_.isPlainObject(config)) config = {};
            config.url = url;
            config.method = item;
            return ajax(config);
        };
    });
    _.each(['post', 'put'], (index, item) => {
        ajax[item] = function (url, data, config) {
            if (!_.isPlainObject(config)) config = {};
            config.url = url;
            config.method = item;
            config.data = data;
            return ajax(config);
        };
    });
    ajax['all'] = function all(promiseList) {
        if (!_.isArrayLike(promiseList)) throw new TypeError('promiseList must be an array or likeArray!');
        return Promise.all(promiseList);
    };
    ajax.stringify = Ajax.prototype.stringify;
    // 支持二次配置更改
    ajax.defaults = {
        headers: headers
    };

    if (typeof window !== "undefined") {
        window.ajax = ajax;
    }
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = ajax;
    }
})();



// 二次配置
ajax.defaults.baseURL = 'http://127.0.0.1:8888';
ajax.defaults.withCredentials = true;
ajax.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
ajax.defaults.transformRequest = data => {
    return ajax.stringify(data);
};

// GET
ajax({
    url: '/user/list',
    params: {
        departmentId: 0,
        search: ''
    },
    cache: false
}).then(response => {
    console.log('OK-->', response);
}).catch(reason => {
    console.log('NO-->', reason);
});

// POST
ajax.post('/user/login', {
    account: 'xxx',
    password: 'xxx'
}).then(response => {
    console.log('OK-->', response);
}).catch(reason => {
    console.log('NO-->', reason);
});