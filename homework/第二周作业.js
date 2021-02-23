class Modal {
    constructor (x,y) {
        this.x = x
        this.y =y
    }
    n = 100
    getX() {
        console.log(this.x);
    }
    getY(){
        console.log(this.y);
    }
    static n = 200
    static setNumber(n){
        this.n=n;
    };
}

Modal.prototype.z=10

let m = new Modal(10,20);

console.log(m)



// function Modal(x,y){
//     this.x=x;
//     this.y=y;
//     this.n=100;
// }
// Modal.prototype.z=10;
// Modal.prototype.getX=function(){
//     console.log(this.x);
// }
// Modal.prototype.getY=function(){
//     console.log(this.y);
// }
// Modal.n=200;
// Modal.setNumber=function(n){
//     this.n=n;
// };
// let m = new Modal(10,20);
// console.log(m)