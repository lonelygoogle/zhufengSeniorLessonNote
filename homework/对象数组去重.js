let log = console.log.bind(console);
let person = [
     {id: 6, name: "小huang"},
     {id: 5, name: "小明"},
     {id: 1, name: "小张"},
     {id: 2, name: "小李"},
     {id: 3, name: "小孙"},
     {id: 1, name: "小周"},
     {id: 2, name: "小陈"},   
];

let obj = {};

person = person.reduce((accumulator,currentValue,i) => {
    log(i,'操作前obj[currentValue.id]', obj[currentValue.id])
    log(i,'操作前accumulator', JSON.stringify(accumulator))
    log(i,'操作前currentValue', currentValue)
    obj[currentValue.id] ? "" : (obj[currentValue.id] = true) && accumulator.push(currentValue);
    // obj[currentValue.id] ? "" : (obj[currentValue.id] = true) && accumulator.push(currentValue);
    log(i,'操作后obj[currentValue.id]', obj[currentValue.id])
    log(i,'操作后accumulator', JSON.stringify(accumulator))
    log(i,'操作后currentValue', currentValue)
    return accumulator;
},[]) //设置accumulator默认类型为数组，并且初始值为空的数组
log(obj);
log(person);

