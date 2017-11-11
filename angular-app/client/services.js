'use strict';

/* Client Services */

angular.module('client.services', []).

	factory('loanFactory', ['$http', '$q', function($http, $q) {
		var loanData = {
			requestInfo: {}
		};

		return {
			getInstalments: function(data) {
				var json = JSON.parse('{"maximum_duration_date":"2015-08-07","instalments":[{"date":"2015-06-09","amount":"220.8","interest":"148.2","principal":"72.6","fee":"0"},{"date":"2015-07-09","amount":"250.48","interest":"96.57","principal":"153.91","fee":"0"},{"date":"2015-07-10","amount":"250.47","interest":"1.98","principal":"248.49","fee":"0"}]}');
				var deferred = $q.defer();
				deferred.resolve(json);
				return deferred.promise;
			},
			requestLoan: function(data) {
				data.csrf_token = config.csrf_token;
				return $http({
					method: "post",
					url: "api/v1/loan/request_loan",
					data: data
				});
			},
			setLoanData: function(data) {
				loanData.requestInfo = data;
			},
			getLoanData: function() {
				return loanData.requestInfo
			}
		}
	}]).

	factory('clientFactory', ['$http', 'transformRequest', function($http, transformRequest) {
		return {
			getLoanRequestData: function() {

				var promise = $http({
					method: "post",
					url: "api/v1/client/get_loan_request_data",
					data: {csrf_token: config.csrf_token}
				}).success(function (data) {
					return data;
				});

				return promise;
			},
			updateClientFields: function(data) {
				data.csrf_token = config.csrf_token;
				return $http({
					method: "post",
					url: "api/v1/client/update_client_fields",
					data: data,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					transformRequest: function(obj) {
						return transformRequest.formPost(obj);
					},
				});
			},
			getUpdateFields: function() {
				return $http({
					method: "post",
					url: "api/v1/client/get_update_fields",
					data: {csrf_token: config.csrf_token}
				});
			}
		}
	}]);