function getRandomNumber() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * 100);
      if (randomNumber < 50) {
        resolve(randomNumber);
      } else {
        reject("Number too large");
      }
    }, 1000);
  });
}

const promise1 = getRandomNumber();
const promise2 = getRandomNumber();
const promise3 = getRandomNumber();

Promise.allSettled([promise1, promise2, promise3])
  .then((results) => {
    console.log("results", results);
    const successfulPromises = results.filter(
      (result) => result.status === "fulfilled"
    );
    const sum = successfulPromises.reduce(
      (total, result) => total + result.value,
      0
    );
    console.log("Sum of resolved values:", sum);
  })
  .catch((error) => {
    console.error("At least one promise rejected:", error);
  });
