//?简单实现Object.create() 创建一个新对象,使用现有的对象来提供新创建的对象的__proto__

function create(obj){
  function F(){};
  F.prototype = obj;
  return new F();
}

var obj = {
  name:"hym",
  age:18
}

let test = create(obj);
console.log(test.name)  //hym