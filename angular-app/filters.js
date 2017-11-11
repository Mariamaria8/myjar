'use strict';

/* Filters */

angular.module('myjar.filters', []).

	filter('mobileFormat', function () {
		return function (tel) {
			// 
		}
	}).

	filter('instalmentDateFormat', function () {
		return function (date) {
			var momentDate = moment(date, "YYYY-MM-DD");
			return momentDate.format('ddd') + ' ' + momentDate.format('DD/MM/YYYY');
		}
	});