({
    appDir: "../dist/temp",
    baseUrl: "./",
    dir: "../dist/staged",
//    optimize: "none",  // for debugging only
    logLevel : 0, 
    locale: "en-us",
    packagePaths: {
        './': [
            'core'
        ]
        'packages': [
			'examplePackage'
		]
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
    modules: [
        {
            name: "main",
            include: "app/main",
            exclude: [ "settings.local" ]
        },
        {
            name: "packages/examplePackage",
            exclude: [ "./main" ]
        }
    ]
})
