'use strict';

/* Client Overview Directives */

angular.module('client.overview.directives', []).

	// Slider
	directive('slider', ['$timeout', 'loanFactory', 'myjarConfig', function($timeout, loanFactory, myjarConfig) {

		var isMobile = myjarConfig.mobile
									
		var poundSlider = [
			'<h2 class="large" ng-class="{\'pb0\': CLisMin == true && isMobile, \'pb25 pt45\': CLisMin == true && !isMobile }">£[[sliderPoundValue]]</h2>',
			'<div class="slider-container" ng-show="CLisMin != true" ng-class="{\'inactive\': creditLimit == CLisMinValue}">',
				'<span class="decrease" ng-click="decreaseValue(25, creditLimit == CLisMinValue ? true : false)">-</span><span class="increase" ng-click="increaseValue(25, creditLimit == CLisMinValue ? true : false)">+</span>',
				'<input ng-disabled="creditLimit == CLisMinValue" type="range" ng-min="creditLow" min="[[creditLimit == CLisMinValue ? 0 : creditLow]]" ng-max="creditLimit" max="[[creditLimit]]" value="" step="25">',
				'<span class="pull-left minmax">£[[creditLow]]</span>',
				'<span class="pull-right minmax">£[[creditLimit]]</span>',
			'</div>'
		].join('');

		var daySlider = [
			'<h2 class="large">[[sliderDayValue]] Days</h2>',
			'<p>Loan due date: <strong>[[earlierPaymentDate | instalmentDateFormat]]</strong></p>',
			'<div class="slider-container">',
				'<span class="decrease" ng-click="decreaseValue(1)">-</span><span class="increase" ng-click="increaseValue(1)">+</span>',
				'<input type="range" min="1" max="[[loanDuration]]" value="" step="1">',
				'<span class="pull-left minmax">1 Day</span>',
				'<span class="pull-right minmax">[[loanDuration]] Days</span>',
			'</div>'
		].join('');

		return {
			require: "?ngModel",
			scope: true,
			template: function (elem, attrs) {
				return attrs.slider == 'pound' ? poundSlider : daySlider;
			},
			link: function($scope, element, attrs, ngModel) {

				var minimumValue;
				var maximumValue;

				if(attrs.slider == 'pound') {
					// Because credit limits are now changing values
					$scope.$watch('creditLow', function(newVal) {
						minimumValue = newVal;
					});
					$scope.$watch('creditLimit', function(newVal) {
						maximumValue = newVal;
					});					
				} else {
					minimumValue = 1;
					maximumValue = $scope.loanDuration;
				}

				var newValue;

				$scope.decreaseValue = function(amount, inactive) {
					if(inactive) return false;
					newValue = $scope.sliderValue[attrs.slider] - amount;
					if(newValue >= minimumValue) {
						$('input', element).val(newValue).change();
						$('input', element).rangeslider('update');
						$scope.sliderValue[attrs.slider] = newValue;
					}					
				}

				$scope.increaseValue = function(amount, inactive) {
					if(inactive) return false;
					newValue = $scope.sliderValue[attrs.slider] + amount;
					$('input', element).val(newValue).change();
					$('input', element).rangeslider('update');
					if(newValue <= maximumValue) $scope.sliderValue[attrs.slider] = newValue;
				}

				if(attrs.slider == 'day') {
					$('input', element).attr('min', minimumValue);
					$('input', element).attr('max', maximumValue);
					$('input', element).val(maximumValue).change();
				}

				$scope.CLS = {
					creditLimit: $scope.creditLimit,
					CLisMinValue: $scope.CLisMinValue
				};

				if(attrs.slider == 'pound') {
					$scope.$watch('creditLimit', function(newVal, oldVal) {
						if(oldVal == 100 && oldVal != newVal) {
							$('input', element).rangeslider('update');
						}
					});
				}

				$scope.$watch('sliderDayValue', function(newVal, oldVal) {

					if(attrs.slider == 'pound') {
						var limits = $scope.creditLimitObj[newVal];

						if(!_.isUndefined(limits)) {

							// Modify slider html for new min max values
							$('input', element).attr('min', limits.lower);
							$('input', element).attr('max', limits.upper);
							$scope.creditLow = limits.lower;
							$scope.creditLimit = limits.upper;
							$('input', element).rangeslider('update');

							// Keep the pound value the same if max min change
							if(limits.lower > $scope.sliderPoundValue) {
								$scope.sliderValue[attrs.slider] = limits.lower;
							} else if(limits.upper < $scope.sliderPoundValue) {
								$scope.sliderValue[attrs.slider] = limits.upper;
							}

							// Change slider value based on updated limits from duration array
							$('input', element).val($scope.sliderPoundValue).change();

							// When sliders are initialized then pound slider is giving null value
							if($scope.sliderPoundValue === null) {
								$scope.sliderValue[attrs.slider] = limits.upper;
								$('input', element).val(limits.upper).change();
							}							
						}
					}

				});

				$('input', element).rangeslider({
					polyfill: false,
					rangeClass: 'vantageslider',
					fillClass: 'vantageslider__fill',
					handleClass: 'vantageslider__handle',

					// Callback function
					onSlide: function(position, value) {
						if(!$scope.$$phase) {
							$scope.$apply(function () {
								$scope.sliderValue[attrs.slider] = value;
							});
						}
					},

					// Callback function
					onSlideEnd: function(position, value) {
						$('input', element).rangeslider('update');
					},
					onInit: function() {
						// 
					}
				});

				if($scope.CLisMin && attrs.slider == 'pound') {
					$('input', element).val($scope.CLisMinValue).change();
				}

			}
		}
	}]);