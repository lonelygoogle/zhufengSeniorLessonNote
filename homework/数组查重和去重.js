// let s = Symbol();
// console.log(typeof s)

// let s1 = Symbol('a');
// let s2 = Symbol('b');
// console.log(s1)
// console.log(s2)
// console.log(s1 == s2)

// let a = Object.prototype.toString.call([])
// console.log(a)
// let b = typeof []
// console.log(b)

function uniqueArr(arr){            
    for(let i=0; i<arr.length; i++){
        for(let j=i+1; j<arr.length; j++){
            if(arr[i]==arr[j]){         //第一个和后面一个重复，splice方法删除后一个
                arr.splice(j,1);
                j--;
            }
        }
    }
return arr;
}

let a = [0, 0 , 1, 1 ,4,{}, "true", true, 13, NaN, "NaN", "NaN",false, undefined, null, NaN, null, undefined,"NaN", 0, "a", {}, 1, 1, 2,3,3,4]
let b = uniqueArr(a)
console.log(b)