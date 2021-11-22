let obj = {};
let input = document.getElementById("input");
let span = document.getElementById("span");

//数据劫持，实现对象text属性的拦截
Object.defineProperty(obj,'text',{
  configurable:true,
  enumerable:true,
  set:function(val){
    input.value = val;  //设置数据时，页面更新
    span.innerHTML = val; //输入框数据改变，span内容变化
  },
  get:function(){
    console.log("获取数据")
  }
})

//输入框输入监听
input.addEventListener("keyup",function(e){
  obj.text = e.target.value;
  console.log(obj.text)
})

