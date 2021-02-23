const arr = [10, 20, 30, 40];

let sum = arr.reduce(function(result, item, b, c){
    console.log(result, item, b, c)
    return result+item
})

console.log(sum)
console.log(arr)