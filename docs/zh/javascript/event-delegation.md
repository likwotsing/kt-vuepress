# Event

## 事件委托

[事件委托](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_delegation)：当需要在很多元素上绑定事件时，利用事件冒泡的特性，把绑定事件添加到它们的父元素上，而不是给很多的子元素绑定事件。

```html
<ul id="parent-list">
	<li id="post-1">Item 1</li>
	<li id="post-2">Item 2</li>
	<li id="post-3">Item 3</li>
	<li id="post-4">Item 4</li>
	<li id="post-5">Item 5</li>
	<li id="post-6">Item 6</li>
</ul>
```

```js
document.getElementById("parent-list").addEventListener("click", function(e) {
	// e.target is the clicked element!
	// If it was a list item
	if(e.target && e.target.nodeName == "LI") {
		// List item found!  Output the ID!
		console.log("List item ", e.target.id.replace("post-", ""), " was clicked!");
	}
});
```

## 节流与防抖

[在线例子](http://demo.nimius.net/debounce_throttle/)

浏览器的滚动、窗口大小调整、按键等事件，可能会在短时间内触发多次，会导致严重的性能问题，所以需要使用**防抖**和**节流**来提升页面性能。这两种方式的本质都是以闭包的形式，通过对事件相应的回调函数进行包裹，以自由变量的形式缓存时间信息，最后用setTimeout来控制事件的触发频率。

### 节流(Throttle)

在某段时间内，不管事件触发了多少次，只执行第一次。

使用场景：window.onresize()、mousemove、上传进度。

实现方案有2种：

- 使用时间戳来判断是否已达到执行时间，记录上次执行的时间戳，然后每次触发事件执行回调，回调中判断当前时间戳距离上次执行时间戳的间隔是否已经达到时间差，如果是则执行，并更新上次执行的时间戳，如此循环。
- 使用定时器，比如当scroll事件刚触发时，设置wait时间的定时器，此后每次触发scroll事件触发回调，如果已经存在定时器，则回调不执行，直到定时器触发，handler被清除，然后重新设置定时器。

```js
function throttle(fn, interval) {
  let last = 0 // 上一次触发回调的时间

  // 将throttle处理结果当做函数返回
  return function() {
    // 保留调用时的this上下文
    let context = this
    // 保留调用时传入的参数
    let args = arguments
    // 记录本次触发回调的时间
    let now = +new Date()

    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last >= interval) {
      // 如果时间间隔大于我们设定的时间间隔阈值，则执行回调
      last = now
      fn.apply(context, args)
    }
  }
}

// 用throttle来包装scroll的回调
const better_scroll = throttle(() => console.log('滚动触发'), 2000)
window.onresize = better_scroll
```

### 防抖(Debounce)

在某段时间内，不管事件触发了多少次，只执行最后一次。

```js
function debounce(fn, delay) {
  let timer = null

  return function() {
    let context = this
    let args = arguments
    // 每次事件被触发时，都清除之前的旧定时器
    if (timer) {
      clearTimeout(timer)
    }
    // 设立新定时器
    timer = setTimeout(function() {
      fn.apply(context, args)
    }, delay)
  }
}

const better_scroll = debounce(() => console.log('触发了'), 2000)
window.onresize = better_scroll
```

### 用Throttle来优化Debounce

debounce存在的问题：如果用户的操作十分频繁，每次都不等debounce设置的delay时间结束就进行下一次操作，于是每次debounce都为该用户重新生成定时器，回调函数被延迟了不计其数次，频繁的延迟会导致用户迟迟得不到响应，用户同样会产生“这个页面卡死了”的感觉。

优化：delay时间内，可以重新生成定时器，但只要delay的时间到了，必须要给用户一个响应。

```js
function throttle(fn, delay) {
  let last = 0, timer = null
  return function() {
    let context = this
    let args = arguments
    let now = +new Date()

    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last < delay) {
      // 小于时间间隔，则为本次触发操作设置一个新的定时器
      clearTimeout(timer)
      timer = setTimeout(function() {
        last = now
        fn.apply(context, args)
      }, delay)
    } else {
      // 超出时间间隔，必须给用户一个反馈
      last = now
      fn.apply(context, args)
    }
  }
}

const better_scroll = throttle(() => console.log('触发了'), 2000)
window.onresize = better_scroll;
```

