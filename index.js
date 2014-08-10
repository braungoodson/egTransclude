var eg = eg || {};

eg.directives =  eg.directives || {};

eg.Router = Router;

eg.directives.SimpleTransclusion = SimpleTransclusion;
eg.directives.Navigator = Navigator;

function Router ($routeProvider) {
	$routeProvider.when('/home',{templateUrl:'views/home.html'});
	$routeProvider.when('/directives',{templateUrl:'views/directives.html'});
	$routeProvider.when('/signin',{templateUrl:'views/signin.html'});
	$routeProvider.otherwise({redirectTo:'/home'});
}

function SimpleTransclusion () {
	return {
		restrict: 'A',
		transclude: true,
		template: '<div class="panel panel-default">' +
					'<div class="panel-heading"><h3 class="panel-title">Panel title</h3></div>' +
					'<div class="panel-body">' +
						'<div ng-transclude></div>' +
					'</div>' +
				  '</div>'
		,
	};
}

function Navigator ($location) {
	return {
		restrict: 'A',
		link: function (scope,element) {
			scope.$on('$locationChangeSuccess',function(){
				var children = element.children()
				children.find('a').parent().removeClass('active');
				children.find('a[href="#'+$location.path()+'"]').parent().addClass('active');
			});
		}
	};
}

var app = angular.module('app',['ngRoute','egClock']);

app.config(['$routeProvider',eg.Router]);

app.directive('egSimpleTransclusion',[eg.directives.SimpleTransclusion]);

app.directive('egNavigator',['$location',eg.directives.Navigator]);

angular
	.module('egClock',[])
	.directive('egClock',[function(){
		return {
			restrict: 'A',
			transclude: false,
			template: '<span class="clock tick">{{date}}</span>',
			controller: 'ClockController'
		};
	}])
	.controller('ClockController',['$scope','$interval',function($scope,$interval){
		tick();
		$interval(tick,1000);
		function tick () {
			var date = new Date();
			var hours = date.getHours() % 12;
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			var meridiem = hours >= 12 ? 'AM' : 'PM';
			minutes = minutes < 10 ? '0' + minutes : minutes;
			seconds = seconds < 10 ? '0' + seconds : seconds;
			date = hours + ':' + minutes + ':' + seconds + ' ' + meridiem;
			$scope.date = date;
			angular.element('.clock').toggleClass('tick',false);
			angular.element('.clock').toggleClass('tick',true);
		}
	}])
;