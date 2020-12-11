// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $('.siteList');
var $lastLi = $siteList.find('li.last');
var x = localStorage.getItem('x');
var xObject = JSON.parse(x);
var hashMap = xObject || [{
  logo: 'A',
  url: 'https://www.acfun.cn'
}, {
  logo: 'B',
  url: 'https://www.bilibili.com'
}];

var urlDemo = function urlDemo(url) {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, ''); //删除 / 开头的内容
}; //创建渲染


hashMap.forEach(function (node) {
  var $li = $("<li>\n     <a href=\"".concat(node.url, "\">\n            <div class=\"site\">\n            <div class=\"logo\">").concat(node.logo[0], "</div>\n            <div class=\"link\">").concat(node.url, "</div>\n            </div>\n        </a>\n    </li>")).insertBefore($lastLi);
});

var render = function render() {
  //渲染哈希之前需把之前的给清空了
  $siteList.find('li:not(.last)').remove();
  hashMap.forEach(function (node, index) {
    // console.log(index)    
    var $li = $("<li>\n                <div class=\"site\">\n                <div class=\"logo\">".concat(node.logo[0], "</div>\n                <div class=\"link\">").concat(urlDemo(node.url), "</div>\n                <div class=\"close\">\n                    <svg class=\"icon\">\n                        <use xlink:href=\"#icon-close\"></use>\n                    </svg>\n                </div>\n                </div>\n        </li>")).insertBefore($lastLi);
    $li.on('click', function () {
      window.open(node.url);
    });
    $li.on('click', '.close', function (e) {
      // console.log('这里')
      e.stopPropagation();
      hashMap.splice(index, 1);
      render();
    });
  });
};

render();
$('.addButton').on('click', function () {
  var url = window.prompt('请问你要添加的网址是啥？');

  if (url.indexOf('http') !== 0) {
    url = 'http://' + url;
  } //当你点击的时候我不在创造li了，我需要push一个到哈希map里


  hashMap.push({
    logo: urlDemo(url)[0].toUpperCase(),
    url: url
  }); //做完之后，需要吧上面的forEach重新执行一遍，但是你会发现，会重叠！！！
  //所以需要哈希里面单独渲染，新增的这个站点
  // $siteList.find('li:not(.last)').remove() //不要最后一个
  // hasMap.forEach(node=>{
  //     const $li = $(`<li>
  //         <a href="${node.url}">
  //             <div class="site">
  //             <div class="logo">${node.logo[0]}</div>
  //             <div class="link">${node.url}</div>
  //             </div>
  //         </a>
  //     </li>`).insertBefore($lastLi)
  // })

  render();
});

window.onbeforeunload = function () {
  //console.log('页面要关闭了')
  var string = JSON.stringify(hashMap); //console.log(typeof string)
  //变成字符串之后就可以存到 window.localStorage 里面

  localStorage.setItem('x', string); //意思就是在本地的存储里面设置一个x,里面存着的就是string
}; // 监听键盘按下事件


$(document).on('keypress', function (e) {
  var key = e.key;

  for (var i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url);
    }
  }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.268174d5.js.map