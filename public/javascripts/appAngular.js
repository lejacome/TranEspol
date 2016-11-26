 angular.module('appAngular', ['ngRoute', 'angular-table','ngBootbox','ui.bootstrap','optimumModel','ngSanitize', 'ui.select','dndLists','btford.socket-io'])
 .config(function ($routeProvider) {
 	$routeProvider
 		.when('/', {
 			templateUrl: 'templates/home.html',
 			controller: 'homeController',
 			access: {
 				restricted: false,
 				rol: 2
 			}
 		})
 		.when('/login', {
 			templateUrl: 'templates/login/loginIndex.html',
 			controller: 'loginController',
 			access: {
 				restricted: true,
 				rol: 1
 			}
 		})
 		.when('/logout', {
 			controller: 'logoutController',
 			access: {
 				restricted: true,
 				rol: 1
 			}
 		})
 		.when('/accessDenied', {
 			template: '<center><h2>Access Dennied!</h2></center>',
 			access: {
 				restricted: true,
 				rol: 1
 			}
 		})
 		.when('/userList', {
 			templateUrl: 'templates/users/userList.html',
 			controller: 'userController',
 			access: {
 				restricted: false,
 				rol: 1
 			}
 		})
 		.otherwise({
 			redirectTo: '/'
 		});
 })
 /**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      var keys = Object.keys(props);
        
      items.forEach(function(item) {
        var itemMatches = false;

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
})

 .run(function ($rootScope, $location, $route, AuthService, $http, $window) {
 	$rootScope.$on('$routeChangeStart', function (event, next, current) {
 		var session;
 		$rootScope.titleWeb = "meanCase";
 		//Window Width
 		var windowWidth = $window.innerWidth;
 		/*    Configuration Tables     */
 		var itemsPerPage, maxPages;
 		if (windowWidth <= 600) {
 			//Mobile
 			itemsPerPage = 5;
 			maxPages = 3;
 		} else if (windowWidth <= 992) {
 			//Tablet
 			itemsPerPage = 5;
 			maxPages = 5;
 		} else {
 			//PC
 			itemsPerPage = 5;
 			maxPages = 8;
 		}
 		$rootScope.configTable = {
 			itemsPerPage: itemsPerPage,
 			maxPages: maxPages,
 			fillLastPage: "yes"
 		};

 		/*    Configuration Tables     */
 		/*    Users Labels rols    */
 		$rootScope.labelRol = [
							    { id: 1,      rol: 'reader'},
							    { id: 2,      rol: 'edit'},
							    { id: 3,      rol: 'coordinator'},
							    { id: 4,      rol: 'admin'},
							    { id: 5,      rol: 'root'}
							  ];
 		/*    Users Labels rols    */

 		$http.get('/cookie').
 		success(function (data) {
 			if (!data.comp) {
 				session = false;
 			} else {
 				session = data.comp;
 				$rootScope.user    = data.user;
        if (next.$$route.originalPath == '/login' && session == true) {
          $location.path('/');
        }
 			}
      $rootScope.project = data.project;
 			if (next.access.rol) {
 				if (data.user.rol) {
 					if (data.user.rol < next.access.rol) {
 						$location.path('/accessDenied');
 					}
 				}
 			}

 			//Menu Exeptions
 			if (next.$$route.originalPath == '/login' || next.$$route.originalPath == '/register') {
 				$rootScope.route = false;
 			} else {
 				$rootScope.route = true;
 			}
 			if (session == false && next.access.restricted == false) {
 				$location.path('/login');
 			}
      if (next.$$route.originalPath == '/exportProject') {
        if (data.user.rol == 5 && data.project.projectType == 2 ){
          $location.path('/exportProject');
        }else{
          $location.path('/');
        }
      }
      
      //Menu Exeptions

 		});
 	});
 })