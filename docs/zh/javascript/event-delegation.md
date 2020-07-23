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

浏览器的滚动、窗口大小调整、按键等事件，可能会在短时间内触发多次，会导致严重的性能问题，所以需要使用**防抖**和**节流**来提升页面性能。这两种方式的本质都是以闭包的形式，通过对事件相应的回调函数进行包裹，以自由变量的形式缓存时间信息，最后用setTimeout来控制事件的触发频率。

### 节流(Throttle)

在某段时间内，不管事件触发了多少次，只执行第一次。



### 防抖(Debounce)

在某段时间内，不管事件触发了多少次，只执行最后一次。