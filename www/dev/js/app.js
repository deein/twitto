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
        'bootstrap': 'bootstrap',
        'angular': 'angular',
        'angular-resource': 'angular-resource',
        'lodash': 'lodash'
    }
});
require(['jquery', 'bootstrap', 'angular', 'angular-resource', 'lodash'], function(jQuery) {
    jQuery(function() {
        jQuery(document).ready(function() {
			console.log('It works !');
		});
    });
});