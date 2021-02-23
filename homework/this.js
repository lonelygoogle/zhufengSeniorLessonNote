// function fn () {
//     function b () {
//         console.log(this)
//     }
//     b()
// }

// fn()

var obj = {
    name: 'obj',
    fn: function () {
        console.log(this)
    }
}

obj.fn()

var f = obj.fn
f()