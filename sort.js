//快排
let quickSort = function (arr) {
  if (arr.length <= 1) {
    return arr;
  }

  let mid = Math.floor(arr.length / 2);
  let pivot = arr.splice(mid, 1)[0];
  let left = [];
  let right = [];
  for (let i = 0; i < arr.length; ++i) {
    if (arr[i] < pivot) {
      left.push(arr[i]); //比[mid]小的放在左边，大的放在右边
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat([pivot], quickSort(right));
};

//选择排（选择最小的元素进行交换）
let selectSort = function (arr) {
  if (arr.length <= 1) {
    return arr;
  }

  let len = arr.length;
  for (let i = 0; i < len; ++i) {
    let min = i;
    for (let j = min + 1; j < len; ++j) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    let temp = arr[i];
    arr[i] = arr[min];
    arr[min] = temp;
  }
  return arr;
};

//直接插入排序（分成有序区和无序区）
let insertSort = function (arr) {
  if (arr.length <= 1) {
    return arr;
  }

  let len = arr.length;
  for (let i = 1; i < len; ++i) {
    let insertNum = arr[i];
    let j = i;
    while (j > 0 && insertNum < arr[j - 1]) {
      arr[j] = arr[j - 1]; //将有序区大的数往后一个空位
      j--;
    }
    arr[j] = insertNum;
  }
  return arr;
};

//冒泡排（反向循环，减少遍历次数）
let bubbleSort = function(arr){
  if (arr.length <= 1) {
    return arr;
  }

  let len = arr.length;
  for (let i = len-1; i>=0; --i) {
    for(let j = 0; j<i; j++){
      if(arr[j]>arr[j+1]){
        let temp = arr[j+1];  //将最大的数向后移动
        arr[j+1] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}

var a = [13, 13, 78, 3, 2, 6, 4, 7];
console.log(bubbleSort(a));
