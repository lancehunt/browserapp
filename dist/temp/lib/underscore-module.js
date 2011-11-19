define([
    'order!./lib/underscore',
    'order!./lib/underscore.string'
],
    function(underscore, _s) {
        // attach underscore.string to the underscore library
        _.mixin(_s);
    });