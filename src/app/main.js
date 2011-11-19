define([
		'require',
        'core',
        'i18n!./nls/resource',
		'./appViewModel',
		"text!./app.tmpl.htm"
    ], function ( require, core, resource, StartViewModel, template ) {

        return function () {
            var vm = new ViewModel();

			core.log('initializing app');
			core.css.loadCss(req.toUrl('./less/application.css'));

			$('body').append(template);
			ko.applyBindings(vm)
        };
    });