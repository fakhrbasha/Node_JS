# Essay Questions

1. **_What is the difference between forEach and for...of? When would you use each? (0.5 Grade)_**

### _forEach_ : this function in array It loops over each element in the array and executes the callback function

- easy to use
- didn't use a break or a continuo
- You can't keep her waiting if you want it to continue in any way (don't wait) don't use await

```js
const arr = [1, 2, 3];
arr.forEach((num) => {
  console.log(num);
});
```

### _for... of_ : A loop is built inside JavaScript use to Iterable anything arr,str,set ...

- you can use await and break or a continuo
- didn't access about index and didn't support objects

```js
const arr = [1, 2, 3];
for (const num of arr) {
  console.log(num);
}
```

2. **_What is hoisting and what is the Temporal Dead Zone (TDZ)? Explain with examples. (0.5 Grade)_**

### _hoisting_ : mean js move declaration of variable and function in top of scope before exe **declare not value**

```js
console.log(a); // undefined not error
var a = 10;
```

_why undefined_

```js
// js take variable declare in top
var a; // declaration hoisted
console.log(a); // undef
a = 10; // init
```

```js
sayHi(); // no error here run

function sayHi() {
  console.log('Fakhr Basha');
}
```

- let and const not support hosting

### _Temporal Dead Zone (TDZ)_ : It starts from the beginning of the scope until the moment the variable is initialized (let | const)

- ReferenceError

```js
console.log(x); // ReferenceError
let x = 5;
```

- x take in TDZ but if datatype var -> undef

  3.**_What are the main differences between == and ===? (0.5 Grade)_**

### _==_ : named loop Equality

- Compares values after performing type coercion if types are different

```js
console.log(5 == '5'); // true => string "5" converted to number 5
console.log(true == 1); // true  => true converted to 1
console.log(null == undefined); // true
```

### _===_ Strict Equality

- Compares both value and type no type convert

```js
console.log(5 === '5'); // false  number != string
console.log(true === 1); // false  boolean != number
console.log(null === undefined); // false
console.log(5 === 5); // true
```

4. **Explain how try-catch works and why it is important in async operations. (0.5 Grade)\_**

**try-catch is a JavaScript construct that handles errors gracefully instead of crashing the program**

```js
try {
  // Code may have error
} catch (error) {
  // Code to handle the error
}
```

```js
try {
  let result = fakhrFunction();
  console.log(result);
} catch (error) {
  console.log('Something error ', error.message);
}
```

```js
async function fetchData() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log('Failed to fetch data:', error.message);
  }
}
fetchData();
```

5.**_ What’s the difference between type conversion and coercion? Provide examples of each. (0.5 Grade)_**

### _Type Conversion_ : when convert data manually convert from type to another

```js
// str to num
let num = Number('123');
console.log(num); // 123
console.log(typeof num); // "number"

// num to str
let str = String(456);
console.log(str); // "456"
console.log(typeof str); // "string"
```

### _Type Coercion_ : when js convert data automatic from type to another

```js
// num + str => js converts num to str
console.log(5 + '5'); // "55" (str)

// Boolean in arithmetic
console.log(true + 1); // 2 (true becomes 1)

// Comparison coercion
console.log('10' == 10); // true ("10" str convert to num)
```
