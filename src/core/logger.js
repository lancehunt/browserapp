define(function () {
    var Logger = function () {
		
    };

    Logger.prototype = {
		trace : window.trace,
		error : window.trace,
		warn : window.trace
    };
    return Logger;
});