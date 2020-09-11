# event-loop

[参考](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/?utm_source=html5weekly)

- 任务(Tasks)按照顺序执行，浏览器渲染在它们之间进行

- 微任务(Microtasks)按照顺序执行，

  - 在每个回调函数后执行，只要没有JavaScript代码在执行中（JS stack是空的）
  - 在每个任务（Task）之后执行

- MutationObserver：当有mutation微任务被pending时（也就是微任务队列中已经存在了mutation），**不可以**再往微任务队列添加mutation

  - 为啥不会再添加mutation了呢？[参考](https://dom.spec.whatwg.org/#queue-a-mutation-record)的第一条，*interestedObservers*是一个[map](https://infra.spec.whatwg.org/#ordered-map)

  - 如果需要多个mutation，那就新new一个MutationObserver，再挂到dom元素上：

    ```js
    const elementToObserve = document.querySelector("#targetElementId");
    const observer2 = new MutationObserver(function () {
        console.log('callback 22222');
    });
    observer2.observe(elementToObserve, { childList: true });
    ```

    

## 简单例子

```js
console.log('script start');

setTimeout(function () {
  console.log('setTimeout');
}, 0);

Promise.resolve()
  .then(function () {
    console.log('promise1');
  })
  .then(function () {
    console.log('promise2');
  });

console.log('script end');
```

结果：

```js
script start, script end, promise1, promise2, setTimeout
```

## 点击事件冒泡

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .outer {
      width: 92px;
      padding: 25px;
      margin: 0 auto;
      background-color: #eee;
    }
    .inner {
      width: 0;
      padding: 46px;
      background-color: #aaa;
    }
  </style>
</head>

<body>
  <div class="outer">
    <div class="inner"></div>
  </div>

  <script>
    // Let's get hold of those elements
    var outer = document.querySelector('.outer');
    var inner = document.querySelector('.inner');

    // Let's listen for attribute changes on the
    // outer element
    new MutationObserver(function () {
      console.log('mutate');
    }).observe(outer, {
      attributes: true,
    });

    // Here's a click listener…
    function onClick() {
      console.log('click');

      setTimeout(function () {
        console.log('timeout');
      }, 0);

      Promise.resolve().then(function () {
        console.log('promise');
      });

      outer.setAttribute('data-random', Math.random());
    }

    // …which we'll attach to both elements
    inner.addEventListener('click', onClick);
    outer.addEventListener('click', onClick);

    // inner.click() // 先注释掉
  </script>
</body>

</html>
```

点击inner后，执行结果：

```js
click, promise, mutate, click, promise, mutate, timeout, timeout
```

1. script脚本执行完
2. 点击inner，触发onClick，回调结束之后，执行栈是空的，所以执行microtasks
3. 触发outer的onClick，回调函数结束之后，执行栈是空的，执行microtasks
4. 执行下一个task

## js执行点击事件

在以上代码里，取消`inner.click()`的注释，查看执行结果。

1. script脚本执行，触发`inner.click()`事件
2. inner的onClick回调结束后，会进行冒泡，script脚本还在执行栈（JS stack）中，所以不会执行microtasks
3. outer的onClick触发，回调结束后，script脚本执行完，在script这个task执行完后，会执行microtasks
4. 执行下一个task

> inner.click()是在JS执行栈里执行的，冒泡也还是在该执行栈里，所以在inner的onClick回调函数结束之后，并不会执行微任务，因为执行栈不是空的。