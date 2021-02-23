const numValidate = function (num) {
    num = Number(num)
    // console.log(num)
	return isNaN(num) ? 0 : num
}

Number.prototype.plus = function (num) {
    num = numValidate(num)
    // console.log(num)
	return this + num
}

Number.prototype.minus = function (num) {
	num = numValidate(num)
	return this - num
}

let n = 10
let m = n.plus(10).minus(5)
console.log(m)
