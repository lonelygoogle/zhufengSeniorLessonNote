function handle(total) {
    total = total.split('|').reduce((result, item) => {
        return Number(result) + Number(item);
    });
    total += '';
    let reg = /\d/g,
        arr = total.match(reg);
    return arr.reverse().map((item, index) => {
        let zero = index === 0 ? '' : new Array(index).fill('0').join('');
        return item + zero;
    }).reverse().join('-');
}
class Cash {
    constructor(num) {
        let type = typeof num;
        if (type !== "number" && type !== "string") throw new TypeError('num must be an number or string~');
        if (type === "string") return Object(handle(num));
        this.value = num;
        this.toString = () => {
            return this.value + '|';
        };
        return this;
    }
    add(obj) {
        if (!(obj instanceof Cash)) throw new TypeError('obj must be an Cash example!');
        return handle(this + obj);
    }
    static add(obj1, obj2) {
        if (!(obj1 instanceof Cash) || !(obj2 instanceof Cash)) throw new TypeError('obj1 or obj2 must be an Cash example!');
        return handle(obj1 + obj2);
    }
}
let cash1 = new Cash(186);
let cash2 = new Cash(53);
const sum1 = cash1.add(cash2);
const sum2 = Cash.add(cash1, cash2);
const sum3 = new Cash(cash1 + cash2);
console.log(sum1, sum2, sum3);