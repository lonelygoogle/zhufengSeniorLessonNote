// function queryPaiMing() {
//   return new Promise(resolve => {
//       console.log('executor执行')
//       console.log('除夕重学promise')
//   });
// }

// queryPaiMing().then(result =>{
//   console.log('then中的result', result)
// })

// let p1 = new Promise((resolve, reject) => {
//     console.log('OK'); //1
// });
// console.log('NO'); //2 

function timeout(ms) {
  return new Promise((resolve, reject) => {
    console.log('外面同步')
    setTimeout(()=> {
      resolve(1)
      console.log('定时器中的同步')
    }, ms, 'done');
    
  });
}

timeout(100).then((value) => {
  console.log(value);
});