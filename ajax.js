//!简单的Ajax请求，XMLHttpRequest对象的基本使用
function simpleAjax (method, url, data, fn) {
  method = method.toUpperCase();
  let xhr = new XMLHttpRequest(); //实例化
  xhr.open(method, url, true); //初始化：请求方法、请求地址、是否异步请求
  //xhr.setRequestHeader('contenType','application/x-www-form-urlencoded')   //当请求为POST或PUT
  //状态变化回调处理请求结果
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
      fn.call(this, xhr.responseText); //回调fn
    }
  }

  if (method == 'POST' || method == 'PUT') {
    xhr.send(data);
  } else if (method == 'GET' || method == 'DELETE') {
    xhr.send();
  }
}

//?simpleAjax测试
/* var btn = document.getElementById('btn');
btn.onclick = function () {
  simpleAjax('get', 'http://127.0.0.1:3000/getGoodsComment?articleid=2', null, function (data) {
    console.log(data);
  })
} */


//!Promise实现Ajax
function ajax ({
  url = '',
  method = 'GET',
  data = {},
  header = {
    'Content-Type': 'application/json'
  },
  dataType = 'json',
  responseType = 'text',
  timeout = 60000
}) {
  return new Promise(function (resolve, reject) {
    method = method.toUpperCase();
    const xhr = new XMLHttpRequest();
    let queryString = '';

    //处理请求参数
    Object.keys(data).forEach(key => {
      queryString += queryString == '' ? '' : '&';
      queryString += encodeURIComponent(key) + '=' + encodeURIComponent(data[
        key]); //对URL进行编码,把字符串作为 URI 组件进行编码
    })

    //拼接url
    if (method == 'GET' && queryString) {
      url = url.includes('?') ? url + '&' + queryString : url + '?' + queryString;
    }

    xhr.open(method, url); //初始化

    //状态改变的回调函数
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        try {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            const response = {
              data: dataType === 'json' ? JSON.parse(xhr.responseText) : xhr.responseText,
              status: xhr.status,
              statusText: xhr.statusText
            }

            resolve(response);
          } else {
            reject('response Error');
          }
        } catch (e) {
          reject(e);
        }
      }
    }

    //设置超时时长
    xhr.timeout = timeout;
    xhr.ontimeout = function () {
      reject('timeout');
    }

    //发送请求
    if (method == 'POST' || method == 'PUT') {
      let contentType = header['Content-Type'];
      xhr.setRequestHeader('Content-Type', contentType);
      console.log(contentType)
      if (contentType == 'application/json') {
        xhr.send(JSON.stringify(data));
      } else if (contentType == 'application/x-www-form-urlencoded') {
        xhr.send(queryString);
      }
    } else if (method == 'GET' || method == 'DELETE') {
      xhr.send();
    }
  })
}

//?ajax测试
/* ajax({
  url: 'http://127.0.0.1:3000/getGoodsComment',
  data: {
    articleid: 2
  }
}).then(function (data) {
  console.log(data);
}, function (err) {
  console.log(err);
})

ajax({
  url: 'http://127.0.0.1:3000/addGoodsComment',
  method: 'POST',
  data: {
    article_id: 2,
    add_time: new Date().toUTCString(),
    username: 'hym',
    content: '这是一个ajax使用测试请求'
  }
}).then(function (data) {
  console.log(data);
}, function (err) {
  console.log(err);
}) */