define(['jquery', 'spin'
], function (jq, Spinner) {
    var projectDefaults = {
                        lines:8,
                        length:27,
                        width:17,
                        radius:17,
                        trail:45,
                        speed:1.7
                    };
    $.fn.spin = function(opts) {
        if(!!opts){
            opts = $.extend(projectDefaults, opts);
        }
        this.each(function() {
            var $this = $(this),
                data = $this.data();

            if (data.spinner) {
                window.trace("stopping spinner");
                data.spinner.stop();
                delete data.spinner;
            }
            if (opts !== false) {
                window.trace("starting spinner");
                data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this);
            }
        });
        return this;
    };
});