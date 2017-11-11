'use strict';

// Declare app level module which depends on filters, services, directives and controllers.
// Helpers functions are included separately
angular.module('myjar', [
		'myjar.filters',
		'myjar.services',
		'myjar.directives',
		'myjar.controllers',
		'ngRoute',
		'ngAnimate',
		'angular-ladda'
	]).

	constant("myjarConfig", {
		"mobile": config.mobile,
		"csrf_token": config.csrf_token,
		"partials": config.assetFolder + '/angular-app/',
		"images": config.assetFolder + '/assets/img/',
		"client_data": config.client_data
	}).

	constant("moment", moment).

	config(function($interpolateProvider, $routeProvider, $locationProvider, myjarConfig, laddaProvider) {
		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');

		$routeProvider
			.when('/:step', {
				templateUrl : myjarConfig.partials + 'application/partials/index.html',
				controller  : 'applicationController',
				reloadOnSearch: false
			});


		$locationProvider.html5Mode({
			enabled: false
		});

		laddaProvider.setOption({ 
			style: 'expand-left'
		});
	})

	.run(['$templateCache', 'myjarConfig', function ($templateCache, myjarConfig) {
		$templateCache.put(myjarConfig.partials + 'application/partials/application_steps.html');
	}]);