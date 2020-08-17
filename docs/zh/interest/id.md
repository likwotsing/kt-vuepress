# 公民身份号码

## 标准

[公民身份号码](http://www.gb688.cn/bzgk/gb/newGbInfo?hcno=080D6FBF2BB468F9007657F26D60013E)

## 代码实现

js判断是否是正确的身份号码

> 验证不全面，只是验证了校验码，没有做出生年月日等的验证

```js
var id = '410531569980205305';

function checkId(id) {
  if (!id) {
    return;
  }
  if (typeof id !== 'string') {
    throw new Error('请输入字符串！')
  }
  id = id.toLocaleUpperCase();
  const weightArr = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 每个位置的加权因子
  const checkcode = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]; // 校验码字符
  let str17 = id.slice(0,17);
  let strCode = id.slice(-1);
  let calcCode;
  let sum17 = 0;
  for(let i = 0; i < 17; i++) {
    sum17 += str17[i] * weightArr[i];
  }
  calcCode = checkcode[sum17 % 11] + ''; // 变成字符串进行比较
  console.log(strCode);
  console.log(calcCode);
  return calcCode === strCode;
}
var r = checkId(id);
console.log(r);
```

