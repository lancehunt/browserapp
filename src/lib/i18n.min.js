/*
 RequireJS i18n 0.25.0 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
(function(){function r(b,a,f,c,d,e){if(a[b]){f.push(b);if(a[b]===true||a[b]===1)c.push(d+b+"/"+e)}}function s(b,a,f,c,d){a=c+a+"/"+d;require._fileExists(b.toUrl(a))&&f.push(a)}function u(b,a,f){for(var c in a)if(!(c in v)&&(!(c in b)||f))b[c]=a[c]}var w=/(^.*(^|\/)nls(\/|$))([^\/]*)\/?([^\/]*)/,v={};define({version:"0.25.0",load:function(b,a,f,c){c=c||{};var d=w.exec(b),e=d[1],o=d[4],g=d[5],p=o.split("-"),h=[],t={},j,i,k="";if(d[5]){e=d[1];b=e+g}else{b=b;g=d[4];o=c.locale||(c.locale=typeof navigator===
"undefined"?"root":(navigator.language||navigator.userLanguage||"root").toLowerCase());p=o.split("-")}if(c.isBuild){h.push(b);s(a,"root",h,e,g);for(j=0;i=p[j];j++){k+=(k?"-":"")+i;s(a,k,h,e,g)}a(h);f()}else a([b],function(q){var m=[];r("root",q,m,h,e,g);for(j=0;i=p[j];j++){k+=(k?"-":"")+i;r(k,q,m,h,e,g)}a(h,function(){var n,l;for(n=m.length-1;n>-1&&(i=m[n]);n--){l=q[i];if(l===true||l===1)l=a(e+i+"/"+g);u(t,l)}f(t)})})}})})();
