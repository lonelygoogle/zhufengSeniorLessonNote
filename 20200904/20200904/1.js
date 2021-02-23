let obj = {
    a: 100,
    b: [10, 20, 30],
    c: {
        x: 10
    },
    d: /^\d+$/,
    e: Symbol('AA'),
    f: new Date(),
    g: function () {},
    h: undefined,
    i: null
};
obj.name = obj;

let arr = [10, [100, 200], {
    x: 10,
    y: 20
}];

// 深克隆的方案
// 方案1:整体变为字符串，再重新变为对象，这样浏览器会重新开辟全套的内存空间存储信息 JSON.stringify/JSON.parse
//   这种办法存在BUG:把对象中的某些属性值变为字符串，会存在问题
//   + 正则变为{}
//   + 日期对象变为日期字符串
//   + Symbol/BigInt/function/undefined等会消失
//   + ...
//   所以这种办法适用于数据中只有 “number/string/boolean/null/普通对象/数组对象” 等内容的时候
// let newArr = JSON.parse(JSON.stringify(arr));
// let newObj = JSON.parse(JSON.stringify(obj));
// console.log(obj, newObj);

// 方案2:自己单独一层层遍历处理
function cloneDeep(obj) {
    // 如果传递的不是对象类型，直接返回对应的值（基本类型/函数/Symbol/BigInt）
    let type = typeof obj;
    if (obj === null) return null;
    if (type !== "object") return obj;
    // 获取当前值的构造函数：获知它的类型
    let constructor = obj.constructor;
    // 如果是正则或者日期函数，我们则创建一个值类似但是不同实例的结果出来
    if (/^(RegExp|Date)$/i.test(constructor.name)) return new constructor(obj);
    // 创造对象的新实例:新数组或者新对象
    let clone = new constructor;
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) break;
        /* // 为了避免对象中的某个属性用的还是这对象，导致的循环嵌套(死递归) 代码本身就应该避免循环嵌套
        if (obj === obj[key]) {
            clone[key] = obj[key];
            break;
        } */
        clone[key] = cloneDeep(obj[key]);
    }
    return clone;
}

// 浅克隆方案
/* let newObj = {
    ...obj
}; */
/* let newObj = Object.assign({}, obj); */
/*
// for in在遍历对象的时候，遍历是当前对象可枚举(列举)的属性
// + 私有属性（除一些特殊的内置属性是不可枚举的）
// + 公有属性（大部分都是不可枚举的，但是自己在类原型上扩展的一般都是可枚举的）
// + ...
// 也说明了在遍历的过程中，很可能遍历到共有的属性方法，所以for in的循环的时候，我们需要判断是否为私有的
let newObj = {};
for (let key in obj) {
    if (!obj.hasOwnProperty(key)) break;
    newObj[key] = obj[key];
} */
// console.log(newObj, obj);

/* let newArr = [...arr];
newArr = Object.assign([], arr);
// 各种循环和迭代
newArr = arr.map(item => item);
newArr = arr.slice();
newArr = arr.concat([]);
console.log(newArr, arr); */