'use strict';

/* Client Overview Controllers */

angular.module('client.overview.controllers', []).

	controller('ClientOverviewController',
		['$scope', '$rootScope', 'loanFactory', 'ModalService', function($scope, $rootScope, loanFactory, ModalService) {

			var defaultIndex = 1;
			$scope.selected = defaultIndex;

			$scope.creditLimit = $scope.loanRequestData.data.loan_request.credit_limit;
			$scope.nextIncomeDate = $scope.loanRequestData.data.next_income_date;
			$scope.productData = JSON.parse($scope.loanRequestData.data.loan_request.limits_per_duration_json);
            $scope.loanDuration = moment($scope.productData[defaultIndex - 1].maximum_duration_date, "YYYY-MM-DD").diff(moment().startOf('day'), 'days');
			$scope.selectedProduct = defaultIndex+'month';
			$scope.tab = defaultIndex;

			//Set default data
            $scope.tabContent = {
                id: $scope.tab,
                productName: $scope.productData[defaultIndex - 1].product_name,
                interestPerDay: $scope.productData[defaultIndex - 1].interest_per_day,
				selectedProductKey: Object.keys($scope.productData[defaultIndex - 1])[3],
				creditLimitObj : $scope.productData[defaultIndex - 1][Object.keys($scope.productData[defaultIndex - 1])[3]],
				selected : $scope.selected
            };

            //Sets tab contents data
            $scope.setTabContent = function(newTab){
                $scope.tab = newTab;
                $scope.tabContent.id = newTab;
                $scope.tabContent.productName = $scope.productData[$scope.tab - 1].product_name;
                $scope.tabContent.interestPerDay = $scope.productData[$scope.tab - 1].interest_per_day;
                $scope.tabContent.selectedProductKey = Object.keys($scope.productData[$scope.tab - 1])[3];
                $scope.tabContent.creditLimitObj = $scope.productData[$scope.tab - 1][Object.keys($scope.productData[$scope.tab - 1])[3]];
                $scope.loanDuration = moment($scope.productData[$scope.tabContent.id - 1].maximum_duration_date, "YYYY-MM-DD").diff(moment().startOf('day'), 'days');
                $scope.selectedProduct = $scope.tabContent.selectedProductKey;
                $scope.selected = $scope.tabContent.id - 1;
            };

			$scope.instalments = [],
			$scope.loanRequestInfo = {};

            $scope.$watch('selectedProduct', function (newVal, oldVal) {
                $scope.selectedProduct = newVal;
                $scope.loanDuration = moment($scope.productData[$scope.tab - 1].maximum_duration_date, "YYYY-MM-DD").diff(moment().startOf('day'), 'days');
                $scope.loanDurationFixed = $scope.productData[$scope.tab - 1].maximum_duration_date;
                $scope.creditLimitObj = $scope.productData[$scope.tab - 1][newVal];

                // Check if credit limit has only one value. Default is 100
                $scope.CLisMin = $scope.creditLimitObj[1].lower == $scope.creditLimitObj[Object.keys($scope.creditLimitObj).length].upper;
                $scope.CLisMinValue = $scope.creditLimitObj[1].lower;

                // Set default credit low limit
                $scope.creditLow = $scope.CLisMinValue;

                $scope.sliderDayValue = $scope.loanDuration;
                $scope.selected = $scope.tab - 1;
            });

			$scope.sliderValue = {
				pound: null,
				day: null
			};

			$scope.$watch('sliderValue', function(newVal) {
				if(!_.isUndefined(newVal.pound) && !isNaN(newVal.pound)) {
					$scope.sliderPoundValue = newVal.pound;
				} else {
					$scope.sliderPoundValue = $scope.CLisMinValue;
				}
				if(!_.isUndefined(newVal.day) && newVal.day !== null) {
					$scope.sliderDayValue = newVal.day;
				} else {
					$scope.sliderDayValue = $scope.loanDuration;
				}
				$scope.earlierPaymentDate = moment().add($scope.sliderDayValue, 'days').format('YYYY-MM-DD');
				$scope.borrowButtonDisabled = true;
			}, true);

			$scope.$watch('sliderValue', $.debounce(300, function(newVal) {				
				$scope.getInstalmentSchedule();
			}), true);

			$scope.getInstalmentSchedule = function() {
				loanFactory.getInstalments({
					next_income_date: $scope.nextIncomeDate,
					earlier_payment_date: $scope.earlierPaymentDate,
					amount: $scope.sliderPoundValue
				}).then(function(response){
					// For test task
					response = {
						data: response
					};

					$scope.instalments = response.data.instalments;
					$scope.loanRequestInfo = {
						principal: 0,
						interest: 0,
						total: function() {
							return parseFloat(this.principal) + parseFloat(this.interest);
						}
					};
					angular.forEach($scope.instalments, function(value, key) {
						$scope.instalments[key].showAmount = parseFloat(value.interest) + parseFloat(value.principal);
						$scope.loanRequestInfo.principal += parseFloat(value.principal);
						$scope.loanRequestInfo.interest += parseFloat(value.interest);						
					});
					$scope.borrowButtonDisabled = false;
				});
			}

			// Client overview modals
			$scope.openRequestConfirmModal = function() {
				$scope.requestData = {
					instalments: $scope.instalments,
					loanAmount: $scope.sliderPoundValue,
					paymentDate: $scope.earlierPaymentDate,
					nextIncomeDate: $scope.nextIncomeDate,
					summary: $scope.loanRequestInfo
				};
				loanFactory.setLoanData($scope.requestData);

				ModalService.showModal({
					templateUrl: '/myjar/angular-app/modals/client/loan-request-confirm.html',
					controller: "ModalController"
				}).then(function(modal) {
					modal.element.remodal().open();
					modal.close.then(function(result) {
						modal.element.remodal().close();
					});
				});
			}

			//$scope.openRequestConfirmModal();

	}]).

	controller('ModalController',
		['$scope', 'loanFactory', function($scope, loanFactory) {
			$scope.requestData = loanFactory.getLoanData();
			
			$scope.requestLoanSchedule = function() {
				$scope.requestLoading = true;
				loanFactory.requestLoan({
					next_income_date: $scope.requestData.nextIncomeDate,
					earlier_payment_date: $scope.requestData.paymentDate,
					amount: $scope.requestData.loanAmount
				}).then(function(response){
					if(response.data.loan_id.length > 0 && response.data.result == 'success') {
						window.location.replace(response.data.redirect);
					}
				});
			}
	}]);