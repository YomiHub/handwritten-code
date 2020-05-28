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