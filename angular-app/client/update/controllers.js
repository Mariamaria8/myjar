'use strict';

/* Client Update page Controllers */

angular.module('client.update.controllers', []).

	controller('ClientUpdateController',
		['$scope', 'clientFactory', 'applicationFactory', 'applicationFieldFactory', 'myjarConfig', '$q', '$timeout',
		function($scope, clientFactory, applicationFactory, applicationFieldFactory, myjarConfig, $q, $timeout) {

			$scope.inputData = applicationFactory.getInputData();
			$scope.update = {};
			$scope.inputDataLoaded = false;
			$scope.updateFields = {};
			$scope.updateFieldsCount = null;

			$scope.runAsync = function() {
				var asyncFn1 = function(data){
					var deferred = $q.defer();
					if(Object.keys($scope.inputData['income']).length === 0) {
						applicationFieldFactory.getInputData('income').then(function(data){
							$scope.inputData['income'] = data.data;
							applicationFactory.setInputData(data.data, 'income');
						});
					}

					if(Object.keys($scope.inputData['about_you']).length === 0) {
						applicationFieldFactory.getInputData('about_you').then(function(data){
							$scope.inputData['about_you'] = data.data;
							applicationFactory.setInputData(data.data, 'about_you');
							deferred.resolve($scope.inputData);
						});
					} else {
						deferred.resolve($scope.inputData);
					}

					return deferred.promise;
				}

				var asyncFn2 = function(data){
					var deferred = $q.defer();
					clientFactory.getUpdateFields().then(function(data) {
						$scope.updateFields = data.data;
						deferred.resolve(data);
					});
					
					return deferred.promise;
				}

				return asyncFn1(1)
				.then(function(data){return asyncFn2(data)});
			}

			$scope.runAsync().then(function(data) {
				$scope.updateFieldsCount = Object.keys($scope.updateFields).length;
				$scope.inputDataLoaded = true;
			});

	}]).

	controller('ClientUpdateFormController',
		['$scope', 'clientFactory', 'applicationFactory', 'applicationFieldFactory',
		function($scope, clientFactory, applicationFactory, applicationFieldFactory) {

		$scope.updateClientFields = function(form) {
			$scope.updateLoading = true;
			if(!_.isUndefined($scope.update.next_income_date)) {
				$scope.update.client_employment_next_income_date = moment($scope.update.next_income_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
			}

			angular.forEach($scope.updateFields, function(value, key) {
				if(_.keys($scope.affordabilityQuestionsForm[key].$error).length > 0) {
					$scope.update[key] = $scope.affordabilityQuestionsForm[key].$viewValue || '';
					$scope.affordabilityQuestionsForm[key].$setViewValue('');
				}
			});

			if(form.$valid) {
				clientFactory.updateClientFields($scope.update).then(function(response) {
					window.location.reload();
				});
			}
		}

	}]);