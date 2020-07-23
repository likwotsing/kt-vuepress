# closure

## closure in a loop

```
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 3000);
}
// 输出了3次3
```

原因是setTimeout函数创建了一个可以访问其外部作用于的函数(闭包)，该作用域是包含索引i的循环。经过3秒后，执行该函数并打印出i的值，该值在循环结束时为3。

修改后，让输出为预期的：0,1,2

```js
for (var i = 0; i < 3; i++) {
  setTimeout(function(i) {
    return function() {
    	console.log(i);   
    }
  }(i), 3000);
}
```

```js
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 3000);
}
```

