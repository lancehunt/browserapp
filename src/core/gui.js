define([], function () {
    var WindowConstructor = function (templateText, viewModelConstructor) {
        this.template = templateText;
        this.viewModelConstructor = viewModelConstructor;
    };

    WindowConstructor.prototype = {
        el: {},
        vm: {},
        template : '',
        viewModelConstructor : function () {},
        init: function ($parent) {
            this.el = $parent.html($(this.template)).get(0);
            this.vm = new this.viewModelConstructor();
            ko.applyBindings(this.vm, this.el);
        },
        close: function () {
            $(this.el).empty();
            if (this.vm && this.vm.dispose) {
                this.vm.dispose();
            }
            this.vm = null;
        }
    };

    return { Window : WindowConstructor };
});