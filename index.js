!function(n){var r={};function o(e){if(r[e])return r[e].exports;var t=r[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,o),t.l=!0,t.exports}o.m=n,o.c=r,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=3)}([function(e,d,p){"use strict";(function(t){var e=p(2),n=setTimeout;function c(e){return Boolean(e&&void 0!==e.length)}function r(){}function i(e){if(!(this instanceof i))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],l(e,this)}function o(n,r){for(;3===n._state;)n=n._value;0!==n._state?(n._handled=!0,i._immediateFn(function(){var e=1===n._state?r.onFulfilled:r.onRejected;if(null!==e){var t;try{t=e(n._value)}catch(e){return void u(r.promise,e)}a(r.promise,t)}else(1===n._state?a:u)(r.promise,n._value)})):n._deferreds.push(r)}function a(t,e){try{if(e===t)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"==typeof e||"function"==typeof e)){var n=e.then;if(e instanceof i)return t._state=3,t._value=e,void s(t);if("function"==typeof n)return void l(function(e,t){return function(){e.apply(t,arguments)}}(n,e),t)}t._state=1,t._value=e,s(t)}catch(e){u(t,e)}}function u(e,t){e._state=2,e._value=t,s(e)}function s(e){2===e._state&&0===e._deferreds.length&&i._immediateFn(function(){e._handled||i._unhandledRejectionFn(e._value)});for(var t=0,n=e._deferreds.length;t<n;t++)o(e,e._deferreds[t]);e._deferreds=null}function f(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n}function l(e,t){var n=!1;try{e(function(e){n||(n=!0,a(t,e))},function(e){n||(n=!0,u(t,e))})}catch(e){if(n)return;n=!0,u(t,e)}}i.prototype.catch=function(e){return this.then(null,e)},i.prototype.then=function(e,t){var n=new this.constructor(r);return o(this,new f(e,t,n)),n},i.prototype.finally=e.a,i.all=function(t){return new i(function(r,o){if(!c(t))return o(new TypeError("Promise.all accepts an array"));var i=Array.prototype.slice.call(t);if(0===i.length)return r([]);var a=i.length;function u(t,e){try{if(e&&("object"==typeof e||"function"==typeof e)){var n=e.then;if("function"==typeof n)return void n.call(e,function(e){u(t,e)},o)}i[t]=e,0==--a&&r(i)}catch(e){o(e)}}for(var e=0;e<i.length;e++)u(e,i[e])})},i.resolve=function(t){return t&&"object"==typeof t&&t.constructor===i?t:new i(function(e){e(t)})},i.reject=function(n){return new i(function(e,t){t(n)})},i.race=function(o){return new i(function(e,t){if(!c(o))return t(new TypeError("Promise.race accepts an array"));for(var n=0,r=o.length;n<r;n++)i.resolve(o[n]).then(e,t)})},i._immediateFn="function"==typeof t&&function(e){t(e)}||function(e){n(e,0)},i._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},d.a=i}).call(this,p(5).setImmediate)},function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";t.a=function(t){var n=this.constructor;return this.then(function(e){return n.resolve(t()).then(function(){return e})},function(e){return n.resolve(t()).then(function(){return n.reject(e)})})}},function(e,n,i){"use strict";i.r(n),function(e){var t,u=i(0),r=i(8);function c(){return parseFloat(t.loadEventEnd-t.navigationStart).toFixed(0)}function o(){var n=null,r=0,o=null,i=0,a=null;return new u.a(function(e,t){n=performance.now(),o=setInterval(function(){r++,55<performance.now()-n?i=0:0<parseInt(c())&&10===++i&&(r-=10,clearInterval(o),a=parseInt(50*r),e(a)),n=performance.now()},50),setTimeout(function(){a||t()},6e4)})}t=performance.timing,window.getReferentialTTI=function(){return new u.a(function(t,e){o().then(function(e){t(e)}).catch(function(){e("Could not calculate TTI within 60000ms")})})},window.getPageTTI=new u.a(function(t,e){var n;"PerformanceLongTaskTiming"in window?((n=window.__tti={e:[]}).o=new PerformanceObserver(function(e){n.e=n.e.concat(e.getEntries())}),n.o.observe({entryTypes:["longtask"]}),r.getFirstConsistentlyInteractive().then(function(e){t(Math.max(e,c()))}).catch(function(){e("Could not calculate TTI within 60000ms")})):o().then(function(e){t(parseInt(c())+parseInt(e))}).catch(function(){e("Could not calculate TTI within 60000ms")})}),exports=e.exports={},n.default={}}.call(this,i(4)(e))},function(e,t){e.exports=function(e){if(!e.webpackPolyfill){var t=Object.create(e);t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),Object.defineProperty(t,"exports",{enumerable:!0}),t.webpackPolyfill=1}return t}},function(e,o,i){(function(e){var t=void 0!==e&&e||"undefined"!=typeof self&&self||window,n=Function.prototype.apply;function r(e,t){this._id=e,this._clearFn=t}o.setTimeout=function(){return new r(n.call(setTimeout,t,arguments),clearTimeout)},o.setInterval=function(){return new r(n.call(setInterval,t,arguments),clearInterval)},o.clearTimeout=o.clearInterval=function(e){e&&e.close()},r.prototype.unref=r.prototype.ref=function(){},r.prototype.close=function(){this._clearFn.call(t,this._id)},o.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},o.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},o._unrefActive=o.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;0<=t&&(e._idleTimeoutId=setTimeout(function(){e._onTimeout&&e._onTimeout()},t))},i(6),o.setImmediate="undefined"!=typeof self&&self.setImmediate||void 0!==e&&e.setImmediate||this&&this.setImmediate,o.clearImmediate="undefined"!=typeof self&&self.clearImmediate||void 0!==e&&e.clearImmediate||this&&this.clearImmediate}).call(this,i(1))},function(e,t,n){(function(e,h){!function(n,r){"use strict";if(!n.setImmediate){var o,i,t,a,u=1,c={},s=!1,f=n.document,e=Object.getPrototypeOf&&Object.getPrototypeOf(n);e=e&&e.setTimeout?e:n,o="[object process]"==={}.toString.call(n.process)?function(e){h.nextTick(function(){d(e)})}:function(){if(n.postMessage&&!n.importScripts){var e=!0,t=n.onmessage;return n.onmessage=function(){e=!1},n.postMessage("","*"),n.onmessage=t,e}}()?(a="setImmediate$"+Math.random()+"$",n.addEventListener?n.addEventListener("message",p,!1):n.attachEvent("onmessage",p),function(e){n.postMessage(a+e,"*")}):n.MessageChannel?((t=new MessageChannel).port1.onmessage=function(e){d(e.data)},function(e){t.port2.postMessage(e)}):f&&"onreadystatechange"in f.createElement("script")?(i=f.documentElement,function(e){var t=f.createElement("script");t.onreadystatechange=function(){d(e),t.onreadystatechange=null,i.removeChild(t),t=null},i.appendChild(t)}):function(e){setTimeout(d,0,e)},e.setImmediate=function(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),n=0;n<t.length;n++)t[n]=arguments[n+1];var r={callback:e,args:t};return c[u]=r,o(u),u++},e.clearImmediate=l}function l(e){delete c[e]}function d(e){if(s)setTimeout(d,0,e);else{var t=c[e];if(t){s=!0;try{!function(e){var t=e.callback,n=e.args;switch(n.length){case 0:t();break;case 1:t(n[0]);break;case 2:t(n[0],n[1]);break;case 3:t(n[0],n[1],n[2]);break;default:t.apply(r,n)}}(t)}finally{l(e),s=!1}}}}function p(e){e.source===n&&"string"==typeof e.data&&0===e.data.indexOf(a)&&d(+e.data.slice(a.length))}}("undefined"==typeof self?void 0===e?this:e:self)}).call(this,n(1),n(7))},function(e,t){var n,r,o=e.exports={};function i(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function u(t){if(n===setTimeout)return setTimeout(t,0);if((n===i||!n)&&setTimeout)return n=setTimeout,setTimeout(t,0);try{return n(t,0)}catch(e){try{return n.call(null,t,0)}catch(e){return n.call(this,t,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:i}catch(e){n=i}try{r="function"==typeof clearTimeout?clearTimeout:a}catch(e){r=a}}();var c,s=[],f=!1,l=-1;function d(){f&&c&&(f=!1,c.length?s=c.concat(s):l=-1,s.length&&p())}function p(){if(!f){var e=u(d);f=!0;for(var t=s.length;t;){for(c=s,s=[];++l<t;)c&&c[l].run();l=-1,t=s.length}c=null,f=!1,function(t){if(r===clearTimeout)return clearTimeout(t);if((r===a||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(t);try{r(t)}catch(e){try{return r.call(null,t)}catch(e){return r.call(this,t)}}}(e)}}function h(e,t){this.fun=e,this.array=t}function m(){}o.nextTick=function(e){var t=new Array(arguments.length-1);if(1<arguments.length)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];s.push(new h(e,t)),1!==s.length||f||u(p)},h.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=m,o.addListener=m,o.once=m,o.off=m,o.removeListener=m,o.removeAllListeners=m,o.emit=m,o.prependListener=m,o.prependOnceListener=m,o.listeners=function(e){return[]},o.binding=function(e){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},function(g,b,e){(function(y){var w;!function(){var n="undefined"!=typeof window&&window===this?this:void 0!==y&&null!=y?y:this,t="function"==typeof Object.defineProperties?Object.defineProperty:function(e,t,n){e!=Array.prototype&&e!=Object.prototype&&(e[t]=n.value)};function r(){r=function(){},n.Symbol||(n.Symbol=e)}var o=0;function e(e){return"jscomp_symbol_"+(e||"")+o++}function i(){r();var e=n.Symbol.iterator;e=e||(n.Symbol.iterator=n.Symbol("iterator")),"function"!=typeof Array.prototype[e]&&t(Array.prototype,e,{configurable:!0,writable:!0,value:function(){return a(this)}}),i=function(){}}function a(e){var t=0;return function(e){return i(),(e={next:e})[n.Symbol.iterator]=function(){return this},e}(function(){return t<e.length?{done:!1,value:e[t++]}:{done:!0}})}function u(e){i();var t=e[Symbol.iterator];return t?t.call(e):a(e)}function c(e){if(!(e instanceof Array)){e=u(e);for(var t,n=[];!(t=e.next()).done;)n.push(t.value);e=n}return e}var s=0;var f="img script iframe link audio video source".split(" ");function l(e,t){for(var n=(e=u(e)).next();!n.done;n=e.next())if(n=n.value,t.includes(n.nodeName.toLowerCase())||l(n.children,t))return!0;return!1}function d(e,t){if(2<e.length)return performance.now();for(var n=[],r=(t=u(t)).next();!r.done;r=t.next())r=r.value,n.push({timestamp:r.start,type:"requestStart"}),n.push({timestamp:r.end,type:"requestEnd"});for(r=(t=u(e)).next();!r.done;r=t.next())n.push({timestamp:r.value,type:"requestStart"});for(n.sort(function(e,t){return e.timestamp-t.timestamp}),e=e.length,t=n.length-1;0<=t;t--)switch(r=n[t],r.type){case"requestStart":e--;break;case"requestEnd":if(2<++e)return r.timestamp;break;default:throw Error("Internal Error: This should never happen")}return 0}function p(e){e=e||{},this.w=!!e.useMutationObserver,this.u=e.minValue||null,e=window.__tti&&window.__tti.e;var t=window.__tti&&window.__tti.o;this.a=e?e.map(function(e){return{start:e.startTime,end:e.startTime+e.duration}}):[],t&&t.disconnect(),this.b=[],this.f=new Map,this.j=null,this.v=-1/0,this.i=!1,this.h=this.c=this.s=null,function(o,i){var a=XMLHttpRequest.prototype.send,u=s++;XMLHttpRequest.prototype.send=function(e){for(var t=[],n=0;n<arguments.length;++n)t[n-0]=arguments[n];var r=this;return o(u),this.addEventListener("readystatechange",function(){4===r.readyState&&i(u)}),a.apply(this,t)}}(this.m.bind(this),this.l.bind(this)),function(i,a){var u=fetch;fetch=function(e){for(var o=[],t=0;t<arguments.length;++t)o[t-0]=arguments[t];return new Promise(function(t,n){var r=s++;i(r),u.apply(null,[].concat(c(o))).then(function(e){a(r),t(e)},function(e){a(e),n(e)})})}}(this.m.bind(this),this.l.bind(this)),function(r){r.c=new PerformanceObserver(function(e){for(var t=(e=u(e.getEntries())).next();!t.done;t=e.next())if("resource"===(t=t.value).entryType&&(r.b.push({start:t.fetchStart,end:t.responseEnd}),m(r,d(r.g,r.b)+5e3)),"longtask"===t.entryType){var n=t.startTime+t.duration;r.a.push({start:t.startTime,end:n}),m(r,n+5e3)}}),r.c.observe({entryTypes:["longtask","resource"]})}(this),this.w&&(this.h=function(n){var e=new MutationObserver(function(e){for(var t=(e=u(e)).next();!t.done;t=e.next())"childList"==(t=t.value).type&&l(t.addedNodes,f)?n(t):"attributes"==t.type&&f.includes(t.target.tagName.toLowerCase())&&n(t)});return e.observe(document,{attributes:!0,childList:!0,subtree:!0,attributeFilter:["href","src"]}),e}(this.B.bind(this)))}function h(e){e.i=!0;var t=0<e.a.length?e.a[e.a.length-1].end:0,n=d(e.g,e.b);m(e,Math.max(n+5e3,t))}function m(i,e){!i.i||i.v>e||(clearTimeout(i.j),i.j=setTimeout(function(){var e=performance.timing.navigationStart,t=d(i.g,i.b);e=(window.a&&window.a.A?1e3*window.a.A().C-e:0)||performance.timing.domContentLoadedEventEnd-e;if(i.u)var n=i.u;else n=performance.timing.domContentLoadedEventEnd?(n=performance.timing).domContentLoadedEventEnd-n.navigationStart:null;var r=performance.now();null===n&&m(i,Math.max(t+5e3,r+1e3));var o=i.a;(t=r-t<5e3?null:r-(t=o.length?o[o.length-1].end:e)<5e3?null:Math.max(t,n))&&(i.s(t),clearTimeout(i.j),i.i=!1,i.c&&i.c.disconnect(),i.h&&i.h.disconnect()),m(i,performance.now()+1e3)},e-performance.now()),i.v=e)}p.prototype.getFirstConsistentlyInteractive=function(){var t=this;return new Promise(function(e){t.s=e,"complete"==document.readyState?h(t):window.addEventListener("load",function(){h(t)})})},p.prototype.m=function(e){this.f.set(e,performance.now())},p.prototype.l=function(e){this.f.delete(e)},p.prototype.B=function(){m(this,performance.now()+5e3)},n.Object.defineProperties(p.prototype,{g:{configurable:!0,enumerable:!0,get:function(){return[].concat(c(this.f.values()))}}});var v={getFirstConsistentlyInteractive:function(e){return e=e||{},"PerformanceLongTaskTiming"in window?new p(e).getFirstConsistentlyInteractive():Promise.resolve(null)}};g.exports?g.exports=v:void 0===(w=function(){return v}.apply(b,[]))||(g.exports=w)}()}).call(this,e(1))}]);