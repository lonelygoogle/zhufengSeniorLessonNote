let arr = []
for (let i =1; i <= 100; i++) {
    arr.push(i)
}

let arrNew = dimensionOneToTwo(arr, 4)
console.log(arrNew)

function dimensionOneToTwo (arr, n) {
    let result = []
    for (let i = 0, len = arr.length; i < len; i += n) {
        result.push(arr.slice(i, i + n))
    }
    return result
}

