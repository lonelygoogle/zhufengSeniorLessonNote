var buttonList = document.querySelectorAll('button');

/* 
// 实现不了的，为啥？
//  + 循环中的i是全局的，每一轮循环给对应元素的click绑定方法（创建函数 [存储代码字符串]，此时函数没有执行）
//  + 循环结束的时候，全局的i=5
//  + 点击某个按钮，执行之前绑定的函数：此时形成一个全新的私有上下文，它的上级上下文是全局上下文，函数代码执行的过程中，遇到变量i，但是i不是自己的私有变量，找到的是全局的i，全局的i是5
for (var i = 0; i < buttonList.length; i++) {
    buttonList[i].onclick = function () {
        console.log(i, `我是第${i+1}个按钮~`);
    };
}
*/

// 改成let就可以了
for (var i = 0; i < buttonList.length; i++) {
    buttonList[i].onclick = function () {
        console.log(i, `我是第${i+1}个按钮~`);
    };
}
// 解决问题的思路：当点击事件触发，执行对应的函数，用到的i不要再向全局查找了；相当于自己形成一个上下文，而自己的上下文中，存储了你需要的i，存储的值是指定的索引即可  =>闭包的保存机制
// 弊端：循环多少次，就产生多少个闭包，非常消耗内存
/* for (var i = 0; i < buttonList.length; i++) {
    // 每一轮循环都会把自执行函数执行，形成一个全新的私有上下文（一共形成了5个）
    //   + 把当前这一轮全局i的值作为实参，传递给当前形成的私有上下文中的形参n[私有变量]
    //   + 第一个私有上下文中的n=0，第二个私有上下文中的n=1 ....
    // 每一个形成的上下文中，创建的函数都被外部的元素对象的onclick占用了，所以形成了5个闭包
    // 当点击按钮执行函数的时候，遇到一个变量n，不是自己私有的，则找上级上下文（闭包）中的n，而n存储的值就是它的索引
    (function (n) {
        buttonList[n].onclick = function () {
            console.log(`我是第${n+1}个按钮~`);
        };
    })(i);
} */
/* for (var i = 0; i < buttonList.length; i++) {
    buttonList[i].onclick = (function (i) {
        // i是每一轮形成的闭包中的私有变量，五个闭包中存储的值分别是0~4[索引]
        // 每一次都是把小函数返回，赋值给元素的点击事件，当点击元素的时候，执行返回的小函数
        return function () {
            console.log(`我是第${i+1}个按钮~`);
        };
    })(i);
} */

/* // 还是基于“闭包的机制”，但是不是自己去执行函数构建，而是利用ES6中let产生的私有上下文实现
for (let i = 0; i < buttonList.length; i++) {
    // 第一轮循环 私有块1
    //   + 私有变量 i = 0
    //   + 当前私有上下文中的创建的一个函数被全局的元素对象的onclick占用了(闭包)
    // ....
    buttonList[i].onclick = function () {
        console.log(`我是第${i+1}个按钮~`);
    };
} */

/* 
// let构建的for循环，底层的处理机制
for (let i = 0; i < 5; i++) {
    // console.log(i);
    i++;
}
console.log(i); //Uncaught ReferenceError: i is not defined */

/* // 方案二：自定义属性（事先把一些信息存储到元素的身上，后期在一些其他的操作中，想要获取这些信息，直接基于元素的属性访问就可以拿到这些值） =>操作DOM的时代下，这种方案非常常用
for (var i = 0; i < buttonList.length; i++) {
    // 把当前按钮的索引存储在它的自定义属性上（每个按钮都是一个元素对象）
    buttonList[i].myIndex = i;
    buttonList[i].onclick = function () {
        // 给当前元素的某个事件绑定方法，当事件触发，方法执行的时候，方法中的this是当前点击的按钮
        console.log(`我是第${this.myIndex+1}个按钮~`);
    };
} */

/* // 方案三：利用事件代理的机制（性能提高>=40%）
document.body.onclick = function (ev) {
    let target = ev.target;
    // 点击的是按钮
    if (target.tagName === "BUTTON") {
        let index = target.getAttribute('index');
        console.log(`我是第${+index+1}个按钮~`);
    }
}; */