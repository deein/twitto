requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: 'js'
    }
});
require.config({
    shim: {
        'jquery': {
            exports: 'jQuery'
        },
        'bootstrap': {
            deps: ['jquery']
        }
    },
    paths: {
        'jquery': 'jquery',
        'bootstrap': 'bootstrap'
    }
});
require(['jquery', 'bootstrap'], function(jQuery) {
    jQuery(function() {
        jQuery(document).ready(function() {
			console.log('It works !');
		});
    });
});