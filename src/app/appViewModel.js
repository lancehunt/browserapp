define([
    'i18n!./nls/resource',
    'require',
    'core',
	'knockout'
], function (resources, req, core, ko) {

    var settings = {}, 
			pubsub = core.pubsub;

    var viewModel = function () {

        this.selectedLocale.subscribe(function (newValue) {
            if (newValue) {
                pubsub.publish('changed-locale', newValue);
            }
        });
    };
    
    viewModel.prototype = {
        res: resources,
        login: function () {
            // Do Logon
        },
        debugOn: ko.observable(true),
        locales: ko.observableArray(settings.locales),
        selectedLocale: ko.observable(window.locale)
    };

    return viewModel;
});
