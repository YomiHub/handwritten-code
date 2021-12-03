//二分查找：适用于从有序的数列中进行查找
function binarySearch(arr, target, start, end) {
  var mid = Math.floor((start + end) / 2);
  console.log(start,end,mid)

  if (start > end) {
    return -1;
  }
  if (target == arr[mid]) {
    return mid;
  } else if (arr[mid] < target) {
    //在右边
    return binarySearch(arr, target, mid + 1, end);
  } else {
    return binarySearch(arr, target, start, mid - 1);
  }
}

var arr = [2, 3, 4, 6, 7, 13, 56, 78];
console.log(binarySearch(arr, 78,0,arr.length-1));
