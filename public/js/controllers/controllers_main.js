var tm_app = angular.module("tm_app", ['ngRoute','ui.bootstrap']);


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
		.otherwise({
			redirectTo : 'views/view_home.html'
		});
});






