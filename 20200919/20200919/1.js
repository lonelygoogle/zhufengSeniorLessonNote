/*
 * 前后端数据通信方案：
 *   + ajax XMLHttpRequest：同源 & 跨域「cors & proxy」
 *     + JQ $.ajax
 *     + axios
 *   + Fetch：同源 & 跨域「cors & proxy」
 *   + webscoket
 *   + jsonp
 *   + postMessage
 *   + iframe + document.domain/location.hash...
 *   + ......
 * 
 * 前后端数据通信的数据格式(POST->请求主体  GET->URL问号传递参数)：
 *   + form-data  MIME:multipart/form-data
 *     + 表单提交
 *     + 文件上传:文件流信息放置在formData中
 *   + x-www-form-urlencoded  MIME:application/x-www-form-urlencoded
 *     + 普通数据的传输一般都用这种方式（这样GET和POST传递给服务器的数据格式统一了）
 *     + 'xxx=xxx&xxx=xxx'
 *     + GET系列请求，URL传递的参数信息其实就是这种格式
 *   + raw 原始格式
 *     + json字符串  MIME:application/json  服务器返回给客户端的数据一般也都是json格式字符串
 *     + text普通字符串  MIME:text/plain
 *     + xml字符串 MIME:application/xml
 *     + ...
 *   + binary 文件流
 *     + 根据上传的文件不同，传递的MIME也是不一样的  例如：image/jpeg 或者 application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
 *     + ...
 *   + GraphQL
 *   + ...
 */
/* let formData = new FormData();
formData.append('name', '珠峰培训');
formData.append('age', 11);
console.log(formData); */


/*
 * axios的应用
 *   http://www.axios-js.com/zh-cn/docs/
 *   基于Promise封装和管理的ajax库(核心XMLHttpRequest)
 * 
 * 语法：
 *   + axios([config])
 *   + axios(url,[config])
 *   + axios.get/delete/head/options(url,[config])
 *   + axios.post/put/patch(url,[data],[config])
 *   + 后面三种都是快捷写法，指定了 请求地址/请求方式/请求主体内容 这些东西,config无需再次配置了，最后处理的方案还是第一种
 *   + 返回的结果都是一个promise实例
 *     + 成功:从服务器获取到结果,并且HTTP状态码是以2开始的 
 *       config -> validateStatus:function(status){
 *            return status >= 200 && status < 300;
 *       }
 *     + 失败:
 *       + 从服务获取到数据了,但是HTTP状态码不是以2开始的
 *       + 没有从服务器获取到数据
 * 
 * 返回结果 
 *   response 对象
 *      status:200
 *      statusText:'OK'
 *      request:基于new XMLHttpRequest创建的xhr对象
 *      headers:响应头信息
 *      data:响应主体信息
 *      config:发送请求的时候传递的配置信息
 *      ==>真实项目中我们最常用的还是响应主体中的信息
 *   reason 对象
 *      config:发送请求的时候传递的配置信息
 *      request:基于new XMLHttpRequest创建的xhr对象
 *      isAxiosError:true/false
 *      response:等同于成功返回的response对象，如果没有从服务器获取任何的结果，response是不存在的
 * 
 * 配置信息 config
 *   url:''
 *   method:'get' 
 *   baseURL:''  向服务器发送请求的地址是由baseURL+url完成的
 *   transformRequest:[function(data,headers){  
 *      ...
 *      return data; 
 *   }] 针对于POST系列请求，请求主体传递的信息进行格式化处理，发生在发送ajax请求之前
 *   transformResponse:[function (data) {
 *      ...
 *      return data;
 *   }] 针对于服务器响应主体中的信息，进行的格式化处理，发生在自己.then/catch之前
 *   headers:{}  设置自定义请求头信息
 *   params:{}  GET系列请求问号传递参数的信息（键值对方式存储，也可以是URLSearchParams对象），axios内部默认你是基于paramsSerializer方法中的Qs.stringify方法把params对象变为xxx=xxx&xxx=xxx格式的
 *   data:{} 请求主体传递信息的对象
 *   timeout:0 设置请求超时时间  在这么久的时间内还没有完成数据请求，则触发xhr.ontimeout事件
 *   withCredentials:false 设置定在跨域请求中是否允许携带资源凭证(例如:cookie)
 *   responseType:'json'  axios内部会把服务器返回的信息转换为指定格式的数据，支持：'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
 *   onUploadProgress/onDownloadProgress:function(progressEvent){ ... } 监听上传或者下载的进度，用的是xhr.upload.onprogress事件
 *   validateStatus:function (status) {
 *      return status >= 200 && status < 300;
 *   }
 */

axios.get('/user/login', {
    baseURL: 'http://127.0.0.1:8888'
}).then(response => {
    console.log(response.request);
    return response.data;
}).then(data => {
    console.log('响应主体信息:', data);
});

axios.post('/user/login', {
    // 默认会把对象变为JSON字符串传递给服务器 {"account":"zhufengpeixun","password":"xxxxxx"}
    account: 'zhufengpeixun',
    password: 'xxxxxx'
}, {
    baseURL: 'http://127.0.0.1:8888',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [function (data) {
        return Qs.stringify(data);
    }]
});

/* axios.get('http://127.0.0.1:8888/user/login').then(response => {
    // console.log('成功:', response);
    return response.data;
}).then(data => {
    console.log('响应主体信息:', data);
}).catch(reason => {
    console.dir(reason);
}); */

/* async function fn() {
    try {
        let data = await axios.get('http://127.0.0.1:8888/user/login')
            .then(response => response.data);
        console.log('响应主体信息:', data);
    } catch (reason) {
        console.dir(reason);
    }
}
fn(); */