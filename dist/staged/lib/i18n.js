(function(){function c(a,b,c,d,e,f){b[a]&&(c.push(a),(b[a]===!0||b[a]===1)&&d.push(e+a+"/"+f))}function d(a,b,c,d,e){var f=d+b+"/"+e;require._fileExists(a.toUrl(f))&&c.push(f)}function e(a,c,d){for(var e in c)!(e in b)&&(!(e in a)||d)&&(a[e]=c[e])}var a=/(^.*(^|\/)nls(\/|$))([^\/]*)\/?([^\/]*)/,b={};define({version:"1.0.0",load:function(b,f,g,h){h=h||{};var i,j=a.exec(b),k=j[1],l=j[4],m=j[5],n=l.split("-"),o=[],p={},q,r,s="";j[5]?(k=j[1],i=k+m):(i=b,m=j[4],l=h.locale||(h.locale=typeof navigator=="undefined"?"root":(navigator.language||navigator.userLanguage||"root").toLowerCase()),n=l.split("-"));if(h.isBuild){o.push(i),d(f,"root",o,k,m);for(q=0;r=n[q];q++)s+=(s?"-":"")+r,d(f,s,o,k,m);f(o,function(){g()})}else f([i],function(a){var b=[];c("root",a,b,o,k,m);for(q=0;r=n[q];q++)s+=(s?"-":"")+r,c(s,a,b,o,k,m);f(o,function(){var c,d;for(c=b.length-1;c>-1&&(r=b[c]);c--){d=a[r];if(d===!0||d===1)d=f(k+r+"/"+m);e(p,d)}g(p)})})}})})()