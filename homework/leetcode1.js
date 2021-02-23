// 第一种办法，双层for
// var twoSum = function (nums, target) {
// 	for (let i = 0; i < nums.length; i++) {
// 		for (let j = i + 1; j < nums.length; j++) {
// 			if (nums[i] + nums[j] === target) {
// 				return [i, j]
// 			}
// 		}
// 	}
// }
// 第二种办法，边存边比较
var twoSum = function(nums, target) {
    const map = {}
    for (let i = 0; i < nums.length; i++){
        if(map[target - nums[i] ]){
            return [ map[target - nums[i] ], i]
        }
        map[nums[i]] = i;
        console.log(map)
    }
}
let nums = [1, 5, 2, 3, 8, 5, 2]
let	target = 10
let result = twoSum(nums, target)
console.log(result)

// 第三种办法，边存边比较改成尾递归
// var twoSum = function(nums, target, i = 0, maps = {}) {
//     const map = maps
//         if(map[target - nums[i] ] >= 0 ) {
//             return [ map[target - nums[i] ], i]
//         } else {
//             map[ nums[i] ] = i;
//             i++;
//             if(i < nums.length){
//                 return twoSum(nums, target, i, map)
//             }else {
//                 throw 'error: twoSum is not find'
//             }
//         }
// }

