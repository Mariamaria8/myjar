'use strict';

/* Services */

angular.module('myjar.services', [
	'client.services'
])
	.factory("transformRequest", function() {
		return {
			formPost: function(obj) {
				function transformRequest() {
					var str = [];
					for(var p in obj)
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));

					return str.join("&");
				}

				return transformRequest();
			}
		}
	}).
	factory('partialsFactory', ['myjarConfig', function(myjarConfig) {
		return {
			applicationSteps: function(activeStep) {
				return myjarConfig.partials + 'application/partials/steps/' + activeStep.template
			}
		};
	}]).
	factory('_', function() {
		return window._;
	});