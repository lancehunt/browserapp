define([], function () {
    global = global || {};
    global.$ = {
        when : function () {
            return {
                always: function () {
                    return { fail : function () {
                    }};
                }
            };
        }
    };
    return global.$;
});