'use strict';

/* Client Controllers */

angular.module('client.controllers', [
	'client.overview.controllers',
	'client.update.controllers',
	'angularModalService'
	]).

	controller('ClientController',
		['$scope', 'clientFactory', 'loanFactory', '$q', function($scope, clientFactory, loanFactory, $q) {

	    /*Init requested data*/
            var deferred = $q.defer();
            $scope.getResponseData = function() {
                var getData = function(){
                    var deferred = $q.defer();
                    loanFactory.getRequestData().then(function(data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
                return getData().then(function(data){
                    $scope.loanRequestData = {
                        data : data
                    }
                });
            }

            $scope.getResponseData();
			$scope.loanDuration = moment().add(30, 'days').diff(moment().startOf('day'), 'days');

	}]);