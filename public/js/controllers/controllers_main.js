var tm_app = angular.module("tm_app", ['ngRoute','ui.bootstrap', 'ui-rangeSlider']);


tm_app.config(function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl : 'views/about.html',
			controller : 'controller_about'
		})	
		.when('/home',{
			templateUrl : 'views/about.html',
			controller : 'controller_about'
		})	
		.when('/od_matrices',{
			templateUrl : 'views/od_matrices.html',
			controller : 'controller_od_matrices'
		})	
		.when('/stations_io',{
			templateUrl : 'views/stations_io.html',
			controller : 'controller_stations_io'
		})	
		.when('/twitter',{
			templateUrl : 'views/twitter.html',
			controller : 'controller_twitter'
		})	
		.when('/test_matrixbar',{
			templateUrl : 'views/test_matrixbar.html',
			controller : 'controller_od_matrices'
		})
		.otherwise({
			redirectTo : 'views/view_home.html'
		});
});


tm_app.controller('Controller_ui', function ($scope) {
  $scope.isCollapsed = true;
  
  
});



