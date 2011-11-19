define([
    './css',
    './session',
    './profile',
    './gui',
    'pubsub'
],
function (css, Session, Profile, gui, pubsub) {
    window.app = {};

    window.app.core = {
        css: css,
        pubsub: pubsub,
        session: new Session(),
        profile: new Profile(),
        gui: gui,
        log: window.trace, 
        
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