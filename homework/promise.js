let p = new Promise((resolve,reject)=>{ 
    // 默认promise中的executor是同步执行的
    // setTimeout是异步的
    setTimeout(()=>{
        resolve('买');
    }, 0)
     reject('不买')
  });
  // then方法是异步调用的，事件环
  p.then((value)=>{ // value成功的原因
    console.log(1);
  },(err)=>{ // err失败的原因
    console.log(2)
  });
  console.log(3);