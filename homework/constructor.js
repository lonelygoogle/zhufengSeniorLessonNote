// function Student(name) {
//     getName = function () {
//         console.log(1)
//     }

//     this.getName = function () {
//         console.log(2)
//     }
//     this.name = name
// }

class Student {
    constructor () {
        // this.getName = function () {
        //     console.log(2)
        // }
    }

    getName () {
        console.log(1)
    }


 }

// Student.prototype.getName = function () {
//     console.log(3)
// }

let student = new Student()
student.getName()

// console.log(student.constructor === Student)
// console.log(Student.prototype.constructor === Student)
// console.log(Array.__proto__ === Function.prototype)
// console.log(Object.__proto__ === Function.prototype)
// console.log(Function.__proto__ === Function.prototype)
// console.log(Object.__proto__.__proto__ === Object.prototype)