var locale = localStorage.locale;
require.config({
    packagePaths: {
        './': [
            'core',
			'app'
        ],
        'packages': [
            'examplePackage']
    },
    paths: {
        'order': 'lib/order',
        'text': 'lib/text',
        'i18n': 'lib/i18n',
        'pubsub': 'lib/pubsub',
        'jquery': 'lib/jquery-1.6.2-module',
        'jquery.tmpl': 'lib/jquery.tmpl-module',
        'underscore': 'lib/underscore-module',
        'socket.io': 'lib/socket.io-module',
        'knockout': 'lib/knockout-1.2.1-module',
        'knockoutmapping' : 'lib/knockout.mapping-latest-module',
        'sinon': 'lib/sinon',
        'accounting': 'lib/accounting'
    },
    urlArgs: 'bust=20110714_4' + (new Date()).getTime(),
    locale: locale
});

require([
    'require',
    'order!jquery',
    'order!jquery.tmpl',
    'order!underscore',
    'order!socket.io',
    'order!knockout',
    'order!knockoutmapping',
    'core',
    'app'
],
    function (require, jq, jqTmpl, us, sio, ko, koMap, core, app) {
        var settings = core.settings,
			  pubsub = core.pubsub;

        window.trace = function (errorMessage, object) {
            if (settings.debug) {
                try {
                    if (object) {
                        console.log(errorMessage, object);
                    } else {
                        console.log(errorMessage);
                    }
                } catch (e) {
                    if (object) {
                        alert(errorMessage + " " + object.toString());
                    } else { alert(errorMessage); }
                }
            }
        };

        var main = {
            start: function () {

            }
        };

        main.start();
    });
