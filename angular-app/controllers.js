'use strict';

/* Controllers */

angular.module('myjar.controllers', [
	'client.controllers'
	]).

	controller('MyjarController',
		['$scope', '$rootScope', 'myjarConfig', '$location', function($scope, $rootScope, myjarConfig, $location) {

			$scope.imageFolder = myjarConfig.images;
			$scope.partialsFolder = myjarConfig.partials;

			$rootScope.imageFolder = myjarConfig.images;
			$rootScope.partialsFolder = myjarConfig.partials;

			$scope.isMobile = myjarConfig.mobile;
			$scope.client_data = myjarConfig.client_data;

			var pathLastSegment = $location.absUrl().substr($location.absUrl().lastIndexOf('/') + 1);

			if(pathLastSegment == 'application') {
				$location.path('/start');
			}

	}]);