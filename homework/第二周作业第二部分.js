// var obj = { a: 1, b: 2, c: 3 }

// for (key in obj) {
//     console.log(key)
// }

// let arr = ['a', 'b', 'c']

// for (key in arr) {
//     console.log(key)
// }

// for (item of arr) {
//     console.log(item)
// }

person= {
    name: 'hsq'
}

const a = Object.create(person)
a.name = 'gqm'
console.log(a)