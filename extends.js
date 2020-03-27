//!实现一个继承

//?ES6语法糖：通过extends实现继承
class Parent {
  constructor(name) {
    this.name = name;
  }
}

//Es6声明类;类声明不允许再次声明已经存在的类，否则将会抛出一个类型错误。
class Son extends Parent {
  constructor(name, school) {
    super(name);  //调用父级的构造函数
    this.school = school;
  }

  toShcool () {
    console.log(this.name + ' wants go to ' + this.school);
  }
}

var person = new Son('hym', 'GDOU university');
person.toShcool();  //hym wants go to GDOU university


//?构造函数、原型继承、组合继承（借用构造函数.call实现对实例属性的继承，用原型链实现对原型方法和方法的继承）,推荐使用组合继承
function People (name) {
  this.name = name;
  this.say = function () {
    console.log('my name is ' + this.name);
  }
}

/* People.prototype.say = function () {
  console.log('my name is ' + this.name);
} */

//构造函数继承（无法继承父级的prototype上定义的函数）
function Child1 (name, age) {
  People.call(this, name, age);
}

var child1 = new Child1('hym', 18);
child1.say();  //my name is hym

//原型继承（需要重写继承属性）
function Child2 (name, age) {
  this.name = name;
  this.age = age;
}
Child2.prototype = new People();
var child2 = new Child2('hjx', 21);
child2.say();  //my name is hjx

//!组合继承
function create (proto) {
  function F () { };
  F.prototype = proto;
  return new F();
}

function Child3 (name, age) {
  People.call(this, name);  //继承父级的属性
  this.age = age;
}

Child3.prototype = create(Parent.prototype) //继承父级的方法 可以使用es6的方法：Object.create(Parent.prototype); 
Child3.prototype.constructor = Child3;  //修改constructor属性指向的原型，弥补重写原型丢失的constructor

var child3 = new Child3('hyz', 6);
child3.say();  //my name is hyz


//寄生组合继承 
function Child4 (name, age) {
  People.call(this);
  this.name = name;
  this.age = age;
}

(function () {
  var Super = function () { };
  Super.prototype = People.prototype
  Child4.prototype = new Super();  //用一个 F 空的构造函数去取代执行了 Parent 这个构造函数。
})()
var child4 = new Child4('Rainy', 20);
child4.say()  //my name is Rainy