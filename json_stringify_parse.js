//?实现JSON.Stringify()
/*
JSON.stringify(value[, replacer [, space]])：
1. Boolean | Number| String 类型会自动转换成对应的原始值
2. undefined、任意函数以及symbol，会被忽略（出现在非数组对象的属性值中时），或者被转换成 null（出现在数组中时）。
3.不可枚举的属性会被忽略
4.如果一个对象的属性值通过某种间接的方式指回该对象本身，即循环引用，属性也会被忽略。
*/

//判断数据类型的方法  "[object type]"
function getType (attr) {
  let type = Object.prototype.toString.call(attr);
  return type.substr(8, type.length - 9);  //返回类型
}

function jsonStringify (obj) {
  //如果obj为null或者非object类型 则直接返回原值的String
  if (typeof obj !== 'object' || getType(obj) === "Null") {
    return String(obj);
  }

  let json = [];
  let isArr = obj ? getType(obj) === "Array" : false;
  for (let key in obj) {
    //筛选对象自身的属性
    if (obj.hasOwnProperty(key)) {
      let value = obj[key];
      let type = getType(value);

      //循环引用报错
      if (obj === value) {
        console.error(new TypeError("Converting circular structure to JSON"));
        return false;
      }

      //undefined/function/Symbol会被忽略
      if (/Symbol|Function|Undefined/.test(type)) {
        delete obj[key];
        continue;
      }

      //当属性值为对象类型，则递归调用
      if (type === "Object") {
        jsonStringify(value);
      }
      //Number、Null、Boolean类型作为属性值不需要加引号
      value = (type === "Number" || type === "Null" || type === "Boolean" ? value : '"' + value + '"');
      json.push((isArr ? "" : '"' + key + '":') + String(value));  //如果是数组类型则不带key
    }
  }
  //将数组转为字符串
  return (isArr ? "[" : "{") + String(json) + (isArr ? "]" : "}");
}

console.log(jsonStringify([1, 2, 3, 4]));  //[1,2,3,4]
console.log(jsonStringify({ name: 'hym', age: 18 }));  //{"name":"hym","age":18}



//?实现JSON.parse();
/*
JSON.parse(text[, reviver])
解析JSON字符串，构造由字符串描述的JavaScript值或对象。
提供可选的reviver函数用以在返回之前对所得到的对象执行变换(操作)
*/

//![1] 使用eval()运行字符串代码，有xss漏洞，可以对字符串进行敏感词过滤
function evalParse (json) {
  return eval('(' + json + ')');
}

//对敏感词过滤
function jsonParse (json) {
  var rx_one = /^[\],:{}\s]*$/;
  var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
  var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
  if (rx_one.test(json.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) {
    return eval(`(${json})`);
  }
  return false;
}

//![2] 与eval类似，使用new Function()动态编译JS
function funParse (json) {
  return new Function('return ' + json)();
}

console.log(evalParse(jsonStringify({ name: 'hym', age: 18 })));  //{ name: 'hym', age: 18 }
console.log(jsonParse(jsonStringify({ name: 'hym', age: 18 })));  //{ name: 'hym', age: 18 }
console.log(funParse(jsonStringify({ name: 'hym', age: 18 })));  //{ name: 'hym', age: 18 }
