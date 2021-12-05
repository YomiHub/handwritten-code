//?实现map、filter
let isObject = function (obj) {
  return Object.prototype.toString.call(obj) == '[object Object]';
}

//(执行方法的对象，回调函数，执行回调时this的指向)
let map = function (obj, callback, context = null) {
  if ((!isObject(obj) && !Array.isArray(obj)) || typeof callback != 'function') {
    return new TypeError();
  }
  let keys = Array.isArray(obj) ? null : Object.keys(obj),
    len = keys ? keys.length : obj.length,
    res = new Array(len);
  for (let i = 0; i < len; i++) {
    let curKey = keys ? keys[i] : i;
    res[curKey] = callback.call(context, obj[curKey], curKey, obj);
    //every if (!callback.call(context, obj[curKey], curKey, obj)) { return false; }
    //some if (callback.call(context, obj[curKey], curKey, obj)) { return true };
    //filter if (callback.call(context, obj[curKey], curKey, obj)) { res[curKey] = obj[curKey] }
  }
  return res;
}

/*
//测试
let arr = [1, 2, 3, { "name": "hym" }, [1, 2, 3]];
let res = map(arr, function (item, index, arr) {
  console.log(item)
})
console.log(res); */

//?实现flat
//ES5语法糖reduce(接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值) 递归实现
let flat1 = function(arr){
  return arr.reduce(function(res,itt){
    return res.concat(Array.isArray(itt)?flat1(itt):itt)
  },[])
}


//遍历实现（使用ES6的解构赋值）
const flat2 = function(arr){
  var result = [];
  var stack = [...arr];  //解决直接赋值时，改变源数组arr

  console.log(stack);

  while(stack.length!=0){
    var val = stack.pop();

    if(Array.isArray(val)){
      stack.push(...val); //倒序存入
    }else{
      result.unshift(val); 
    }
  }
  return result;
}


// 测试
let arr1 = [
  1,
  [ 2, 3, 4 ],
  [ 5, [ 6, [ 7, [ 8 ] ] ] ]
]
console.log(flat2(arr1)) 

//预先知道层级（太不靠谱了伐）
let flat = function (arr, level = 1) {
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    let val = arr[i];
    if (Array.isArray(val) && level > 0) {
      val = flat(val, level - 1);
      res.push(...val);
    } else if (val !== 'undefined') {
      res.push(val);
    }
  }
  return res;
}


//使用生成器实现数组扁平化
let flatGenerator = function (tree) {
  function* iteTree (tree) {
    if (Array.isArray(tree)) {
      for (let i = 0; i < tree.length; i++) {
        yield* iteTree(tree[i]);
      }
    } else {
      yield tree;
    }
  }
  return [...iteTree(tree)];
}

/*
//测试
let arrflat = [1, 2, [3, 4, [5, 6]], 7];
console.log(flat(arrflat, 2));
console.log(flatGenerator(arrflat));
*/

//来源：https://github.com/lgwebdream/FE-Interview/issues/8
// 【头条】合并二维有序数组成一维有序数组
function merge(arr1,arr2){
  let result = [];
  while(arr1.length>0&&arr2.length>0){
    if(arr1[0]<=arr2[0]){
      //取出第一个元素
      result.push(arr1.shift());
    }else{
      result.push(arr2.shift());
    }
  }
  return result.concat(arr1,arr2)
}

function mergeSort(arr){
  let len = arr.length;
  if(len===0){return []};
  while(arr.length>1){
    //每两项进行合并，并将结果放到数组后面
    let itemPre = arr.shift();
    let itemNext = arr.shift();
    arr.push(merge(itemPre,itemNext));
  }
  return arr[0]
}

let arr1 = [[1,2,3],[4,5,6],[7,8,9],[1,2,3],[4,5,6]];
let arr2 = [[1,4,6],[7,8,10],[2,6,9],[3,7,13],[1,5,12]];
console.log(mergeSort(arr1));
console.log(mergeSort(arr2));