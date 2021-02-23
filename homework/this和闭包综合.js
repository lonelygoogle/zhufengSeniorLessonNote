var num = 1
var obj = {
    num: 2,
    fn: ( function (num) {
        this.num *= 2
        num += 2
        return function () {
            this.num *= 3
            num++
            console.log(num)
        }
    }
    )(num) 
}

var fn = obj.fn
fn()
obj.fn()
console.log(num, obj.num)