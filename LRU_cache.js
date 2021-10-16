// 数组对象实现

var LRUCache = function (capacity) {
  // 用数组记录读和写的顺序
  this.keys = []
  // 用对象来保存key value值
  this.cache = {}
  // 容量
  this.capacity = capacity
}

LRUCache.prototype.get = function (key) {
  // 如果存在
  if (this.cache[key]) {
    // 先删除原来的位置
    remove(this.keys, key)
    // 再移动到最后一个，以保持最新访问
    this.keys.push(key)
    // 返回值
    return this.cache[key]
  }
  return -1
}

LRUCache.prototype.put = function (key, value) {
  if (this.cache[key]) {
    // 存在的时候先更新值
    this.cache[key] = value
    // 再更新位置到最后一个
    remove(this.keys, key)

    this.keys.push(key)
  } else {
    // 不存在的时候加入
    this.keys.push(key)
    this.cache[key] = value
    // 容量如果超过了最大值，则删除最久未使用的（也就是数组中的第一个key）
    if (this.keys.length > this.capacity) {
      removeCache(this.cache, this.keys, this.keys[0])
    }
  }
}

// 移出数组中的key
function remove(arr, key) {
  if (arr.length) {
    const index = arr.indexOf(key)

    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

// 移除缓存中 key
function removeCache(cache, keys, key) {
  cache[key] = null
  remove(keys, key)
}

const lRUCache = new LRUCache(2)

console.log(lRUCache.put(1, 1)) // 缓存是 {1=1}
console.log(lRUCache.put(2, 2)) // 缓存是 {1=1, 2=2}
console.log(lRUCache.get(1))    // 返回 1
console.log(lRUCache.put(3, 3)) // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
console.log(lRUCache.get(2))    // 返回 -1 (未找到)
console.log(lRUCache.put(4, 4)) // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
console.log(lRUCache.get(1) )   // 返回 -1 (未找到)
console.log(lRUCache.get(3))    // 返回 3
console.log(lRUCache.get(4) )   // 返回 4

// 借助Map设置值时可以保持顺序性，处理LRU算法
/**
 * @param {number} capacity
 */
 var LRUCache = function (capacity) {
  this.cache = new Map()
  this.capacity = capacity
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
  if (this.cache.has(key)) {
    const value = this.cache.get(key)
    // 更新位置
    this.cache.delete(key)
    this.cache.set(key, value)

    return value
  }

  return -1
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function (key, value) {
  // 已经存在的情况下，更新其位置到”最新“即可
  // 先删除，后插入
  if (this.cache.has(key)) {
    this.cache.delete(key)
  } else {
    // 插入数据前先判断，size是否符合capacity
    // 已经>=capacity，需要把最开始插入的数据删除掉
    // keys()方法得到一个可遍历对象,执行next()拿到一个形如{ value: 'xxx', done: false }的对象
    if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value)
    }
  }

  this.cache.set(key, value)
};

const lRUCache = new LRUCache(2)


/* 来源链接：https://juejin.cn/post/7018337760687685669 */

