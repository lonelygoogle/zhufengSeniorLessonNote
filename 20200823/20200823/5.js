/*
 * 函数的防抖（防止老年帕金森）：对于频繁触发某个操作，我们只识别一次(只触发执行一次函数)
 *   @params
 *      func[function]:最后要触发执行的函数
 *      wait[number]:“频繁”设定的界限
 *      immediate[boolean]:默认多次操作，我们识别的是最后一次，但是immediate=true，让其识别第一次
 *   @return
 *      可以被调用执行的函数
 */
// 主体思路：在当前点击完成后，我们等wait这么长的时间，看是否还会触发第二次，如果没有触发第二次，属于非频繁操作，我们直接执行想要执行的函数func；如果触发了第二次，则以前的不算了，从当前这次再开始等待...
function debounce(func, wait = 300, immediate = false) {
    let timer = null;
    return function anonymous(...params) {
        let now = immediate && !timer;

        // 每次点击都把之前设置的定时器清除
        clearTimeout(timer);

        // 重新设置一个新的定时器监听wait时间内是否触发第二次
        timer = setTimeout(() => {
            // 手动让其回归到初始状态
            timer = null;
            // wait这么久的等待中，没有触发第二次
            !immediate ? func.call(this, ...params) : null;
        }, wait);

        // 如果是立即执行
        now ? func.call(this, ...params) : null;
    };
}

/*
 * 函数节流：在一段频繁操作中，可以触发多次，但是触发的频率由自己指定
 *   @params
 *      func[function]:最后要触发执行的函数
 *      wait[number]:触发的频率
 *   @return
 *      可以被调用执行的函数
 */
function throttle(func, wait = 300) {
    let timer = null,
        previous = 0; // 记录上一次操作的时间
    return function anonymous(...params) {
        let now = new Date(),
            remaining = wait - (now - previous); //记录还差多久达到我们一次触发的频率
        if (remaining <= 0) {
            // 两次操作的间隔时间已经超过wait了
            window.clearTimeout(timer);
            timer = null;
            previous = now;
            func.call(this, ...params);
        } else if (!timer) {
            // 两次操作的间隔时间还不符合触发的频率
            timer = setTimeout(() => {
                timer = null;
                previous = new Date();
                func.call(this, ...params);
            }, remaining);
        }
    };
}



function handle() {
    console.log('OK');
}
// window.onscroll = handle; //每一次滚动过程中，浏览器有最快反应时间(5~6ms 13~17ms)，只要反应过来就会触发执行一次函数（此时触发频率5ms左右）
window.onscroll = throttle(handle); // 我们控制频率为300ms触发一次
// window.onscroll = function anonymous() {}; //每隔5ms触发一次匿名函数,我们自己可以匿名函数中控制执行handle的频率




// submit.onclick = handle;  //点击一次触发执行一次handle，频繁触发，频繁执行handle
// submit.onclick = function anonymous() {
//     // 在匿名函数中我们控制hanlde只执行一次
// };
// submit.onclick = debounce(handle, 300, true);