// function fn (a, ...args) {
//     console.log(...args)
// }

// fn(1,2,3,4)

// console.log(Object('a'))

// var str1 = 'hello world'
// str1 = new String(str1)
// console.log(str1 instanceof String) 

// let a = new Number(10)
// console.log(a)
// let b = new Number(10)
// console.log(b)
// console.log(a===b)


console.log(!![])
console.log(!!{})
console.log({}+'')
console.log(+'1.1')
console.log(+[])
console.log(+[1])
console.log(+[1,2])
console.log(+null)
console.log(+undefined)
console.log({a: 1} == true);//false
console.log({a: 1} == "[object Object]");//true

var obj = {
  value: 3,
  valueOf() {
    return 4;
  },
  toString() {
    return '5'
  },
  [Symbol.toPrimitive]() {
    return 6
  }
}

// console.log(obj + 1); // 输出7
console.log(obj + '1'); 

var a = {
  value: 0,
  valueOf: function() {
    this.value++;
    return this.value;
  }
};
console.log(a == 1 && a == 2&& a == 3);//true

let obj1 = {
  a: function() {
    console.log(this);
  }
}
let func = obj1.a;
func();
obj1.a()

