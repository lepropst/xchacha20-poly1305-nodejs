var n=new (function(){function k(a){void 0===a&&(a="=");this.j=a}k.prototype.encode=function(a){for(var b="",e=0;e<a.length-2;e+=3){var c=a[e]<<16|a[e+1]<<8|a[e+2];b+=this.i(c>>>18&63);b+=this.i(c>>>12&63);b+=this.i(c>>>6&63);b+=this.i(c>>>0&63)}var f=a.length-e;0<f&&(c=a[e]<<16|(2===f?a[e+1]<<8:0),b+=this.i(c>>>18&63),b+=this.i(c>>>12&63),b=2===f?b+this.i(c>>>6&63):b+(this.j||""),b+=this.j||"");return b};k.prototype.decode=function(a){if(0===a.length)return new Uint8Array(0);var b=this.D(a);b=a.length-
b;for(var e=new Uint8Array(this.I(b)),c=0,f=0,h=0,d,l=0,g=0,m;f<b-4;f+=4)d=this.h(a.charCodeAt(f)),l=this.h(a.charCodeAt(f+1)),g=this.h(a.charCodeAt(f+2)),m=this.h(a.charCodeAt(f+3)),e[c++]=d<<2|l>>>4,e[c++]=l<<4|g>>>2,e[c++]=g<<6|m,h|=d&256,h|=l&256,h|=g&256,h|=m&256;f<b-1&&(d=this.h(a.charCodeAt(f)),l=this.h(a.charCodeAt(f+1)),e[c++]=d<<2|l>>>4,h=h|d&256|l&256);f<b-2&&(g=this.h(a.charCodeAt(f+2)),e[c++]=l<<4|g>>>2,h|=g&256);f<b-3&&(m=this.h(a.charCodeAt(f+3)),e[c++]=g<<6|m,h|=m&256);if(0!==h)throw Error("Base64Coder: incorrect characters for decoding");
return e};k.prototype.I=function(a){return this.j?a/4*3|0:(6*a+7)/8|0};k.prototype.i=function(a){return String.fromCharCode(a+65+(25-a>>>8&6)+(51-a>>>8&-75)+(61-a>>>8&-15)+(62-a>>>8&3))};k.prototype.h=function(a){return 256+((42-a&a-44)>>>8&-256+a-43+62)+((46-a&a-48)>>>8&-256+a-47+63)+((47-a&a-58)>>>8&-256+a-48+52)+((64-a&a-91)>>>8&-256+a-65)+((96-a&a-123)>>>8&-256+a-97+26)};k.prototype.D=function(a){var b=0;if(this.j){for(var e=a.length-1;0<=e&&a[e]===this.j;e--)b++;if(4>a.length||2<b)throw Error("Base64Coder: incorrect padding");
}return b};return k}());
