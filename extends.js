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
    super(name); //调用父级的构造函数
    this.school = school;
  }

  toShcool() {
    console.log(this.name + " wants go to " + this.school);
  }
}

var person = new Son("hym", "GDOU university");
person.toShcool(); //hym wants go to GDOU university

//?构造函数、原型继承、组合继承（借用构造函数.call实现对实例属性的继承，用原型链实现对原型方法和方法的继承）,推荐使用组合继承
function People(name) {
  this.name = name;
  this.say = function () {
    console.log("my name is " + this.name);
  };
}

/* People.prototype.say = function () {
  console.log('my name is ' + this.name);
} */

//构造函数继承（方法在构造函数中定义，无法复用；无法继承父级的prototype上定义的函数）
function Child1(name, age) {
  People.call(this, name, age);
}

var child1 = new Child1("hym", 18);
child1.say(); //my name is hym

//-------原型链继承（需要重写继承属性、不能给父类传参）
function Child2(name, age) {
  this.name = name;
  this.age = age;
}
Child2.prototype = new People();
var child2 = new Child2("hjx", 21);
child2.say(); //my name is hjx

//-------组合继承 （无论在什么情况下，都会调用两次父类型的构造函数）
function Child3(name, age) {
  // 第二次调用了One()，实例对象继承了One的两个属性，会屏蔽掉原型Son.prototype中的两个同名属性
  People.call(this, name);
  this.age = age;
}
// 第一次调用了One()，继承了One的原型方法, Two.prototype会得到Parent的两个属性
Child3.prototype = new People();
Child3.prototype.constructor = Child3;
Child3.prototype.getAge = function () {
  return this.age;
};

//-------原型式继承
//Object.create()实现
function create(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}
var person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"],
};

var Child4 = Object.create(person); // 浅拷贝：对于引用类型的值的属性，会共享
Child4.name = "hym"; //多个实例的引用类型属性指向相同，存在篡改的可能
Child4.friends.push("hym");
console.log(person.friends);

//-------寄生式继承  使用寄生式函数来对对象添加函数，无法做到函数的复用。
function Child5(origin) {
  var clone = Object.create(origin);
  clone.sayAge = function () {
    // 以某种方式来增强对象
    console.log("age");
  };
  return clone;
}

var child5 = Child5(People);
child5.sayAge();

//-------寄生组合继承
function Child6(name, age) {
  People.call(this, name);
  this.age = age;
}

(function () {
  // 创建父类型原型的副本
  const prototype = Object.create(People.prototype);
  // 为创建的副本添加constructor属性，从而弥补因重写原型而失去的默认的constructor属性
  prototype.constructor = Child6;
  // 将创建的副本赋值给子类型的原型
  Child6.prototype = prototype;
})();

Child6.prototype.SayAge = function () {
  console.log(
    "my name is " + this.name + " and I am " + this.age + " years old"
  );
};

var child6 = new Child6("hym", 20);
child6.say(); //my name is hym
child6.SayAge();
