console.log('node 外层this', this);
var name= 'lilei';
var obj = {
  name: 'hanmeimei',
  showName: function() {
    console.log('this', this)
//     setTimeout( function(){
//       console.log('setTimeout this',this);
//       console.log('setTimeout name',this.name);
//     })
    console.log(this.name);
  }
}
setTimeout(obj.showName, 500) 
// obj.showName()