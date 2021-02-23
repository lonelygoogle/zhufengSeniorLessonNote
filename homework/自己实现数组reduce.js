Array.prototype.myReduce = function(fn, prev) {
    for (let i=0; i< this.length ; i++) {
        if (typeof prev === 'undefined') {
            prev = fn(this[i], this[i+1], i+1, this)
            ++i
        } else {
            prev = fn(prev, this[i], i, this)
        }
    }
    return prev
}

let total = [1, 2, 3, 4].myReduce((prev, currentValue, currentIndex, arr) => {
    console.log(prev, currentValue, currentIndex, arr)
	return prev + currentValue
}, 10)

console.log(total)

Array.prototype.myForEach = function (fn) {
	for (let i = 0; i < this.length; i++) {
		fn(this[i], i)
	}
}

;[20, 40, 60, 80].myForEach((item, index) => {
	console.log(item, index)
})

Array.prototype.myMap = function (fn) {
    let arr = []
	for (let i = 0; i < this.length; i++) {
		arr.push(fn(this[i], i))
    }
    return arr
}

let arr = [10, 20, 30, 40].myMap((item) => item * 3)
console.log(arr)

function a() {
    console.log(arguments)
    let arr = Array.from(arguments)
    console.log(arr)
    console.log(eval(arr.join('+')))
}

a(1, 2, 3, 4)

