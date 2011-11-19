
define([], function () {
    var Css = function() {

    };

    function findCss(url, success, notfound) {
        var links = document.getElementsByTagName("link"),
            head = document.getElementsByTagName("head")[0],
            found, i, length;

        for (i = 0,length = links.length; i < length; i++) {
            if (links[i].href === url) {
                if(success) {
                    success(head, links[i]);
                }

                found = true;
            }
        }
        if(!found && notfound) {
            notfound(head);
        }
    }

    Css.prototype = {
        loadCss: function (url) {
            findCss(url, null, function(head) {
                var link = document.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = url;
                head.appendChild(link);                
            });
        },

        unloadCss: function (url) {
            var links = document.getElementsByTagName("link"),
                i, length;

            findCss(url, function(head, link) {
                head.removeChild(link);
            });
        }
    };

    return new Css();
});