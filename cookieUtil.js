//?封装Cookie
let cookieUtil = {
  getCookie: function () {
    let cookie = {},
      allData = document.cookie;
    if (allData === '') {
      return cookie;
    }
    let dataList = allData.split(";");
    console.log(document.cookie)
    for (let item of dataList) {
      let [key, val] = item.split("=");
      cookie[decodeURIComponent(key)] = decodeURIComponent(val);
    }
    return cookie;
  },

  setCookie: function (name, val, options = {}) {
    let cookie = encodeURIComponent(name) + "=" + encodeURIComponent(val);
    if (options.expires && options.expires instanceof Date) {
      cookie = cookie + ";expires=" + options.expires.toUTCString();
    }

    if (options.path) {
      cookie = cookie + ";path=" + options.path;
    }

    if (options.domain) {
      cookie = cookie + ";domain" + options.domain;
    }

    if (options.secure) {
      cookie = cookie + ";secure";
    }
    document.cookie = cookie;
    return true;
  },

  removeCookie: function (name, options = {}) {
    options['expires'] = new Date(0);
    this.setCookie(name, "", options)
  }
}


//!测试
/* let setWrap = document.getElementById("set-wrap");
let getWrap = document.getElementById("get-wrap");
let remove = document.getElementById("remove-btn");
setWrap.addEventListener('click', function (e) {
  if (e.target && e.target.nodeName.toLowerCase() == "input") {
    let dataName = e.target.value;
    cookieUtil.setCookie(dataName, dataName, {
      "expires": new Date("2020-10-01")
    })
  }
}, false)

getWrap.addEventListener('click', function (e) {
  if (e.target && e.target.nodeName.toLowerCase() == "input") {
    let dataName = e.target.value;
    let data = cookieUtil.getCookie();
    let el = document.getElementById("content");
    el.innerHTML = JSON.stringify(data);
  }
}, false)


remove.onclick = function () {
  cookieUtil.removeCookie("username");
  cookieUtil.removeCookie('passWord');
} */