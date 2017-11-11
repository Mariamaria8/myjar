'use strict';

// Declare app level module which depends on filters, services, directives and controllers.
// Helpers functions are included separately
angular.module('myjarHome', [
		'home.services',
		'home.directives',
		'home.controllers',
		'myjar.filters',
		'ngAnimate'
	]).

	constant("myjarConfig", {
		"mobile": config.mobile,
		"csrf_token": config.csrf_token,
		"partials": config.assetFolder + '/angular-app/',
		"images": config.assetFolder + '/assets/img/'
	}).

	constant("moment", moment).

	config(function($interpolateProvider) {
		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');
	});