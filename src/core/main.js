define([
    './css',
	'./session',
	'./logger',	
    'pubsub'
],
function ( css, session, logger, pubsub) {
    window.app = {};

    window.app.core = {
        loadCss: css,
        pubsub: pubsub,
        session: new Session(),
        log: logger.trace, 
        
		// TODO: add services here
        services: {
			
        }
    };

    //TODO: should this go someplace else?:
    app.core.pubsub.subscribe('account-changed', function (event, newValue) {
        app.core.session.selectedAccountNumber = newValue;
    });
    return window.app.core;
});