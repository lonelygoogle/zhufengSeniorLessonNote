function a(){
    var i=0;
    function b(){
        i++;
        console.log(i);
    }
    return b;
}

var c = a();
c();//
c();//
c();//