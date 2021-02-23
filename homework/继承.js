// function Parent() {
// 	this.name = '黄思沁'
// }

// Parent.prototype.eat = function () {
// 	console.log('我喜欢吃肯德基')
// }

// let parent = new Parent()
// parent.__proto__.eat()
// console.log(Parent.prototype.constructor === Parent)
// console.log(Parent.prototype === parent.__proto__)

function Child () {
    this.y = 200
}

Child.prototype.getY = function () {
    return this.y
}

let c1 = new Child
// let c1 = new Child()
console.log(c1)


