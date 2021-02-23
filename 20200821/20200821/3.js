/*
 * EC(G)
 *    a
 *    b = 0x000000
 */
var a = 4; // 全局的a=4
function b(x, y, a) {
    /*
     * EC(B)
     *     x=1
     *     y=2    
     *     a=3
     *   作用域链:<EC(B),EC(G)>
     *   初始THIS:window
     *   初始arguments:[1,2,3]  => {0:1,1:2,2:3,length:3} 类数组
     *   形参赋值:x=1 y=2 a=3
     *   变量提升:--
     */
    console.log(a); // =>3
    arguments[2] = 10; // a=10
    console.log(a); // =>10
}
a = b(1, 2, 3);
console.log(a); // => undefined
// arguments实参集合（类数组集合）