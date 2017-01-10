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
.controller('bootstrapController',
  ['$scope', '$location', 'AuthService','bootstrapService',
  function ($scope, $location, AuthService,bootstrapService) {
    $scope.test = "Menú 1";
         /*  LOGOUT  */
	    $scope.logout = function () {
	      AuthService.logout()
	        .then(function () {
	          $location.path('/login');
	        });

	    };
	    bootstrapService.getMenu().then(function(data) {
	      $scope.menus = data;
	    });	
	    
}])
.controller('homeController',
  ['$rootScope','$scope', '$location', 'AuthService','$uibModal','mySocket',
  function ($rootScope,$scope, $location, AuthService,$uibModal,mySocket) {
    $scope.arrayMsg = [];
    $scope.titleHomeController = "Welcome";
    $scope.testSocket = function(){
    	mySocket.emit('chat message',{user:$rootScope.user.username,input:$scope.msgInput});
    	mySocket.emit('test', 'test test');
      
    }
    $scope.$on('socket:chat message', function(event, data) {
      
      var size = $scope.arrayMsg.length;
      console.log(size);
      if(size > 0){
        var oldUser = $scope.arrayMsg[size-1].user;
        var newUser = data.user;
        if(oldUser =! newUser){
          data["class1"] = "amigo";
          data["class2"] = "derecha";
        }else{
          data["class1"] = "autor";
          data["class2"] = "izquierda";
        }
         
       
      }else{
        data["class1"] = "autor";
        data["class2"] = "izquierda";
      }
      $scope.arrayMsg.push(data);
      $scope.msgInput = '';
      window.setInterval(function() {
        var elem = document.getElementById('mensajes');
        elem.scrollTop = elem.scrollHeight;
      }, 5000);
        
    });
    $scope.$on('socket:test', function(event, data) {
    	console.log(data);
    });
}])
.controller('loginController', ['$rootScope', '$scope', '$location', 'AuthService','$uibModal',
  function ($rootScope, $scope, $location, AuthService,$uibModal) {
		$scope.titleLoginController = "MEAN_CASE HEROIC";
		$rootScope.titleWeb = "Login";
		$scope.registerSuccess = false;
		$scope.login = function () {

			// initial values
			$scope.registerSuccess = false;
			$scope.error = false;
			$scope.disabled = true;
			// call login from service
			AuthService.login($scope.loginForm.username, $scope.loginForm.password, $scope.remember)
				// handle success
				.then(function () {
					$location.path('/');
					$scope.disabled = false;
					$scope.loginForm = {};
				})
				// handle error
				.catch(function () {
					$scope.error = true;
					$scope.errorMessage = "Invalid username and/or password";
					$scope.disabled = false;
					$scope.loginForm = {};
				});

		};

	 /*  Open   Register */
	     $scope.open = function (size) {
	        var modalInstance = $uibModal.open({
	          animation: true,
	          templateUrl: 'templates/login/loginRegister.html',
	          controller: 'registerLoginUserController',
	          size: size
	        });

	        modalInstance.result.then(function(data) {
	          $scope.error = false;
	          $scope.registerSuccess = true;
	          $scope.msjSuccess = "Register Successful";
	        });
	    };

    /*  Open Register    */

		/* REGISTRAR  */
		$scope.register = function () {

			// initial values
			$scope.error = false;
			$scope.disabled = true;

			// call register from service
			AuthService.register($scope.registerForm.username, $scope.registerForm.password, $scope.rol)
				// handle success
				.then(function () {
					$location.path('/');
					$scope.disabled = false;
					$scope.registerForm = {};
				})
				// handle error
				.catch(function (err) {
					$scope.error = true;
					$scope.errorMessage = "User already exists!";
					$scope.disabled = false;
					$scope.registerForm = {};
					$scope.rol = "";
				});

		};

}])
.controller('registerLoginUserController',
  ['$scope', '$uibModalInstance','AuthService','userService',
  function ($scope, $uibModalInstance,AuthService,userService) {
  
    $scope.saving = false;
     
    $scope.save = function () {
        $scope.saving = true;
        AuthService.register($scope.item.username,$scope.item.password,1).then(function(r){
          $scope.saving = false;
        });
        $uibModalInstance.close();
    };

}])
.factory('AuditService',
  ['$q', '$http',
  function ($q, $http) {
    return ({
      allAudit: allAudit,
      create: create,
      del : del,
      edit   : edit
    });
    function allAudit () {
      var defered = $q.defer();
      var promise = defered.promise;
      $http.get('/api/Audit')
        .success(function(data) {
          defered.resolve(data);
        })
        .error(function(err) {
          defered.reject(err)
        });
      return promise;
    }
    function del (id) {
      var defered = $q.defer();
      var promise = defered.promise;
      $http.delete('/api/Audit/' + id)
        .success(function(data) {
           defered.resolve(data);
        })
        .error(function(err) {
          defered.reject(err)
        });
      return promise;
    }
    function create(user,hostname,ip,action,scheme_affected,detail,date,hour) {
      var deferred = $q.defer();
       $http.post('/api/Audit', {user: user,hostname: hostname,ip: ip,action: action,scheme_affected: scheme_affected,detail: detail,date: date,hour: hour})
        .success(function (data, status) {
          deferred.resolve(data);
       })
        .error(function (data) {
          deferred.reject(data);
        });
      return deferred.promise;
    }
    function edit(user,hostname,ip,action,scheme_affected,detail,date,hour,id) {
      var deferred = $q.defer();
       $http.put('/api/Audit/'+id, {user: user,hostname: hostname,ip: ip,action: action,scheme_affected: scheme_affected,detail: detail,date: date,hour: hour})
        .success(function (data, status) {
          deferred.resolve(data);
        })
        .error(function (data) {
          deferred.reject(data);
        });
      return deferred.promise;
    }
}])
.factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create user variable
    var user = null;

    // return available functions for use in controller
    return ({
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      register: register
    });

    function isLoggedIn() {
        if(user) {
          return true;
        } else {
          return false;
        }
    }


    function login(username, password,check) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/login', {username: username, password: password,check: check})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/api/logout')
        // handle success
        .success(function (data) {
          user = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function register(username, password,rol) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/register', {username: username, password: password,rol:rol})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

}])
.factory('bootstrapService',
  ['$q', '$http',
  function ($q, $http) {
  	return ({
      getMenu: getMenu,
    });


    function getMenu () {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('/api/menu')
            .success(function(data) {
                defered.resolve(data);
            })
            .error(function(err) {
                defered.reject(err)
            });

        return promise;
    }


}])
.factory('loginFactorie', function($http) {
        var comun = {};


        return comun;
    })
.factory('mySocket', function (socketFactory) {
      var socket = socketFactory();
      socket.forward('chat message');
      socket.forward('test');
      return socket;
})
.factory('userService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    

    // return available functions for use in controller
    return ({
      allUsers: allUsers,
      deleteUser : deleteUser,
      editUser   : editUser
    });


    function allUsers () {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('/api/users')
            .success(function(data) {
                defered.resolve(data);
            })
            .error(function(err) {
                defered.reject(err)
            });

        return promise;
    }

    function deleteUser (id) {
      var defered = $q.defer();
      var promise = defered.promise;
      $http.delete('/api/users/' + id)
        .success(function(data) {
                defered.resolve(data);
            })
            .error(function(err) {
                defered.reject(err)
            });

        return promise;
    }

   function editUser(username,newUsername, password,rol) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.put('/api/register', {username: username,newUsername: newUsername, password: password,rol:rol})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }





    }])

.service('busModel', function ($optimumModel,marcasModel) {
  var model = new $optimumModel();
  model.url = '/api/bus';
  model.constructorModel = ["marcas","disco","placa","csentados","cparados"];
 model.dependencies = {marcas:marcasModel.url};
  return model;
})


.service('conductorsModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/conductors';
  model.constructorModel = ["nombre","cedula"];
  return model;
})
.service('horariosModel', function ($optimumModel,busModel,conductorsModel,rutasModel,rutasModel) {
  var model = new $optimumModel();
  model.url = '/api/horarios';
  model.constructorModel = ["bus","conductors","rutas","rutas","idruta","idbus","idconductor","fecha","hora"];
 model.dependencies = {bus:busModel.url,conductors:conductorsModel.url,rutas:rutasModel.url,rutas:rutasModel.url};
  return model;
})
.service('marcasModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/marcas';
  model.constructorModel = ["marca","modelo"];
  return model;
})
.service('posicionbusModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/posicionbus';
  model.constructorModel = ["idbus","fecha","latitud","longitud"];
  return model;
})
.service('rutasModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/rutas';
  model.constructorModel = ["nombre","tipo"];
  return model;
})
.service('UsersModel', function ($optimumModel) {
	var model = new $optimumModel();
	model.url = '/api/users';
	model.constructorModel = ['username','password','rol'];
	return model;
})

.config(function ($routeProvider) {
  $routeProvider
    .when('/Audit', {
      templateUrl: '/templates/Audit/auditIndex.html',
      controller: 'AuditController',
      access: {
        restricted: false,
       rol: 4
      }
    });
 })
.controller('AuditController',
  ['$rootScope','$scope', '$location', 'AuditService','$uibModal',
  function ($rootScope,$scope, $location, AuditService,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'Audit';
    $scope.preloader = true;
    $scope.msjAlert = false;
    AuditService.allAudit().then(function(data) {
      $scope.AuditList = data;
      $scope.AuditTemp = angular.copy($scope.AuditList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/Audit/modalCreate.html',
        controller: 'modalAuditCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.AuditList.push(data);
           $scope.AuditTemp = angular.copy($scope.AuditList);
        }
      },function(result){
      $scope.AuditList = $scope.AuditTemp;
      $scope.AuditTemp = angular.copy($scope.AuditList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/Audit/modalDelete.html',
      controller: 'modalAuditDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.AuditList.indexOf(data);
      $scope.AuditList.splice(idx, 1);
      AuditService
        .del(data._id)
        .then(function(result) {
          $scope.msjAlert = true;
          $scope.alert = 'success';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])
.config(function ($routeProvider) {
  $routeProvider
    .when('/bus', {
      templateUrl: '/templates/bus/index.html',
      controller: 'busController',
      access: {
        restricted: false,
       rol: 4
      }
    });
 })
.controller('busController',
  ['$rootScope','$scope', '$location', 'busModel','$uibModal',
  function ($rootScope,$scope, $location, busModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'bus';
    $scope.preloader = true;
    $scope.msjAlert = false;
    busModel.getAll().then(function(data) {
      $scope.busList = data;
      $scope.busTemp = angular.copy($scope.busList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/bus/modalCreate.html',
        controller: 'modalbusCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.busList.push(data);
           $scope.busTemp = angular.copy($scope.busList);
        }
      },function(result){
      $scope.busList = $scope.busTemp;
      $scope.busTemp = angular.copy($scope.busList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/bus/modalDelete.html',
      controller: 'modalbusDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.busList.indexOf(data);
      $scope.busList.splice(idx, 1);
      busModel
        .destroy(data._id)
        .then(function(result) {
          $scope.msjAlert = true;
          $scope.alert = 'success';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])
.controller('modalbusCreateController',
  ['$scope', '$uibModalInstance', 'item','busModel','$filter',"marcasModel",
  function ($scope, $uibModalInstance, item,busModel,$filter,marcasModel) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {disco: $scope.item.disco,placa: $scope.item.placa,csentados: $scope.item.csentados,cparados: $scope.item.cparados};
        var bus = busModel.create();
        bus.marcas = $scope.item.marcas;
        bus.disco = $scope.item.disco;
        bus.placa = $scope.item.placa;
        bus.csentados = $scope.item.csentados;
        bus.cparados = $scope.item.cparados;
        bus.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        busModel.findById($scope.item._id);
        busModel.marcas =  $scope.item.marcas;
        busModel.disco = $scope.item.disco;
        busModel.placa = $scope.item.placa;
        busModel.csentados = $scope.item.csentados;
        busModel.cparados = $scope.item.cparados;
        busModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
    marcasModel.getAll().then(function(data) {
      $scope.marcas = data;
    });
}])
.controller('modalbusDeleteController',
  ['$scope', '$uibModalInstance', 'item',
  function ($scope, $uibModalInstance, item) {
    $scope.item = item;
    $scope.ok = function () {
      $uibModalInstance.close($scope.item);
    };
    $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };
}])

.config(function ($routeProvider) {
  $routeProvider
    .when('/bus', {
      templateUrl: '/templates/bus/index.html',
      controller: 'busController',
      access: {
        restricted: false,
       rol: 4
      }
    });
 })
.config(function ($routeProvider) {
  $routeProvider
    .when('/conductors', {
      templateUrl: '/templates/conductors/index.html',
      controller: 'conductorsController',
      access: {
        restricted: false,
       rol: 4
      }
    });
 })
.controller('conductorsController',
  ['$rootScope','$scope', '$location', 'conductorsModel','$uibModal',
  function ($rootScope,$scope, $location, conductorsModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'conductors';
    $scope.preloader = true;
    $scope.msjAlert = false;
    conductorsModel.getAll().then(function(data) {
      $scope.conductorsList = data;
      $scope.conductorsTemp = angular.copy($scope.conductorsList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/conductors/modalCreate.html',
        controller: 'modalconductorsCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.conductorsList.push(data);
           $scope.conductorsTemp = angular.copy($scope.conductorsList);
        }
      },function(result){
      $scope.conductorsList = $scope.conductorsTemp;
      $scope.conductorsTemp = angular.copy($scope.conductorsList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/conductors/modalDelete.html',
      controller: 'modalconductorsDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.conductorsList.indexOf(data);
      $scope.conductorsList.splice(idx, 1);
      conductorsModel
        .destroy(data._id)
        .then(function(result) {
          $scope.msjAlert = true;
          $scope.alert = 'success';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])
.controller('modalconductorsCreateController',
  ['$scope', '$uibModalInstance', 'item','conductorsModel','$filter',
  function ($scope, $uibModalInstance, item,conductorsModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {nombre: $scope.item.nombre,cedula: $scope.item.cedula};
        var conductors = conductorsModel.create();
        conductors.nombre = $scope.item.nombre;
        conductors.cedula = $scope.item.cedula;
        conductors.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        conductorsModel.findById($scope.item._id);
        conductorsModel.nombre = $scope.item.nombre;
        conductorsModel.cedula = $scope.item.cedula;
        conductorsModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])
.controller('modalconductorsDeleteController',
  ['$scope', '$uibModalInstance', 'item',
  function ($scope, $uibModalInstance, item) {
    $scope.item = item;
    $scope.ok = function () {
      $uibModalInstance.close($scope.item);
    };
    $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };
}])
.config(function ($routeProvider) {
  $routeProvider
    .when('/horarios', {
      templateUrl: '/templates/horarios/index.html',
      controller: 'horariosController',
      access: {
        restricted: false,
       rol: 4
      }
    });
 })
.controller('horariosController',
  ['$rootScope','$scope', '$location', 'horariosModel','$uibModal',
  function ($rootScope,$scope, $location, horariosModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'horarios';
    $scope.preloader = true;
    $scope.msjAlert = false;
    horariosModel.getAll().then(function(data) {
      $scope.horariosList = data;
      $scope.horariosTemp = angular.copy($scope.horariosList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/horarios/modalCreate.html',
        controller: 'modalhorariosCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
           horariosModel.getAll().then(function(d) {
             $scope.horariosList = d;
             $scope.horariosTemp = angular.copy($scope.horariosList);
           });
      },function(result){
      $scope.horariosList = $scope.horariosTemp;
      $scope.horariosTemp = angular.copy($scope.horariosList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/horarios/modalDelete.html',
      controller: 'modalhorariosDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.horariosList.indexOf(data);
      $scope.horariosList.splice(idx, 1);
      horariosModel
        .destroy(data._id)
        .then(function(result) {
          $scope.msjAlert = true;
          $scope.alert = 'success';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])
.controller('modalhorariosCreateController',
  ['$scope', '$uibModalInstance', 'item','horariosModel','$filter',"busModel","conductorsModel","rutasModel","rutasModel",
  function ($scope, $uibModalInstance, item,horariosModel,$filter,busModel,conductorsModel,rutasModel,rutasModel) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
      item.dateAsString1 = $filter("date")(item.fecha, "yyyy-MM-dd");
      item.dateAsString2 = $filter("date")(item.hora, "HH:mm:ss");
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {fecha: $scope.item.fecha,hora: $scope.item.hora};
        var horarios = horariosModel.create();
        horarios.bus = $scope.item.bus;
        horarios.conductors = $scope.item.conductors;
        horarios.rutas = $scope.item.rutas;
        horarios.fecha = $scope.item.fecha;
        horarios.hora = $scope.item.hora;
        horarios.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        if($scope.item.fecha === undefined){
          $scope.item.fecha = Date.parse(item.dateAsString1);
          $scope.item.fecha = new Date($scope.item.fecha);
          $scope.item.fecha = $scope.item.fecha.setDate($scope.item.fecha.getDate() + 1);
        }
        if($scope.item.hora === undefined){
          $scope.item.hora = item.dateAsString2;
        }
        horariosModel.findById($scope.item._id);
        horariosModel.bus =  $scope.item.bus;
        horariosModel.conductors =  $scope.item.conductors;
        horariosModel.rutas =  $scope.item.rutas;
        horariosModel.fecha = $scope.item.fecha;
        horariosModel.hora = $scope.item.hora;
        horariosModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
    busModel.getAll().then(function(data) {
      $scope.bus = data;
    });
    conductorsModel.getAll().then(function(data) {
      $scope.conductors = data;
    });
    rutasModel.getAll().then(function(data) {
      $scope.rutas = data;
    });
    rutasModel.getAll().then(function(data) {
      $scope.rutas = data;
    });
}])
.controller('modalhorariosDeleteController',
  ['$scope', '$uibModalInstance', 'item',
  function ($scope, $uibModalInstance, item) {
    $scope.item = item;
    $scope.ok = function () {
      $uibModalInstance.close($scope.item);
    };
    $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };
}])
.config(function ($routeProvider) {
  $routeProvider
    .when('/posicionbus', {
      templateUrl: '/templates/posicionbus/index.html',
      controller: 'posicionbusController',
      access: {
        restricted: false,
       rol: 4
      }
    });
 })
.controller('posicionbusController',
  ['$rootScope','$scope', '$location', 'posicionbusModel','$uibModal',
  function ($rootScope,$scope, $location, posicionbusModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'posicionbus';
    $scope.preloader = true;
    $scope.msjAlert = false;
    posicionbusModel.getAll().then(function(data) {
      $scope.posicionbusList = data;
      $scope.posicionbusTemp = angular.copy($scope.posicionbusList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/posicionbus/modalCreate.html',
        controller: 'modalposicionbusCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.posicionbusList.push(data);
           $scope.posicionbusTemp = angular.copy($scope.posicionbusList);
        }
      },function(result){
      $scope.posicionbusList = $scope.posicionbusTemp;
      $scope.posicionbusTemp = angular.copy($scope.posicionbusList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/posicionbus/modalDelete.html',
      controller: 'modalposicionbusDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.posicionbusList.indexOf(data);
      $scope.posicionbusList.splice(idx, 1);
      posicionbusModel
        .destroy(data._id)
        .then(function(result) {
          $scope.msjAlert = true;
          $scope.alert = 'success';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])
.controller('modalposicionbusCreateController',
  ['$scope', '$uibModalInstance', 'item','posicionbusModel','$filter',
  function ($scope, $uibModalInstance, item,posicionbusModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
      item.dateAsString1 = $filter("date")(item.fecha, "yyyy-MM-dd");
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {idbus: $scope.item.idbus,fecha: $scope.item.fecha,latitud: $scope.item.latitud,longitud: $scope.item.longitud};
        var posicionbus = posicionbusModel.create();
        posicionbus.idbus = $scope.item.idbus;
        posicionbus.fecha = $scope.item.fecha;
        posicionbus.latitud = $scope.item.latitud;
        posicionbus.longitud = $scope.item.longitud;
        posicionbus.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        if($scope.item.fecha === undefined){
          $scope.item.fecha = Date.parse(item.dateAsString1);
          $scope.item.fecha = new Date($scope.item.fecha);
          $scope.item.fecha = $scope.item.fecha.setDate($scope.item.fecha.getDate() + 1);
        }
        posicionbusModel.findById($scope.item._id);
        posicionbusModel.idbus = $scope.item.idbus;
        posicionbusModel.fecha = $scope.item.fecha;
        posicionbusModel.latitud = $scope.item.latitud;
        posicionbusModel.longitud = $scope.item.longitud;
        posicionbusModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])
.controller('modalposicionbusDeleteController',
  ['$scope', '$uibModalInstance', 'item',
  function ($scope, $uibModalInstance, item) {
    $scope.item = item;
    $scope.ok = function () {
      $uibModalInstance.close($scope.item);
    };
    $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };
}])
.config(function ($routeProvider) {
  $routeProvider
    .when('/rutas', {
      templateUrl: '/templates/rutas/index.html',
      controller: 'rutasController',
      access: {
        restricted: false,
       rol: 4
      }
    });
 })
.controller('rutasController',
  ['$rootScope','$scope', '$location', 'rutasModel','$uibModal',
  function ($rootScope,$scope, $location, rutasModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'rutas';
    $scope.preloader = true;
    $scope.msjAlert = false;
    rutasModel.getAll().then(function(data) {
      $scope.rutasList = data;
      $scope.rutasTemp = angular.copy($scope.rutasList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/rutas/modalCreate.html',
        controller: 'modalrutasCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.rutasList.push(data);
           $scope.rutasTemp = angular.copy($scope.rutasList);
        }
      },function(result){
      $scope.rutasList = $scope.rutasTemp;
      $scope.rutasTemp = angular.copy($scope.rutasList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/rutas/modalDelete.html',
      controller: 'modalrutasDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.rutasList.indexOf(data);
      $scope.rutasList.splice(idx, 1);
      rutasModel
        .destroy(data._id)
        .then(function(result) {
          $scope.msjAlert = true;
          $scope.alert = 'success';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])
.controller('modalrutasCreateController',
  ['$scope', '$uibModalInstance', 'item','rutasModel','$filter',
  function ($scope, $uibModalInstance, item,rutasModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {nombre: $scope.item.nombre,tipo: $scope.item.tipo};
        var rutas = rutasModel.create();
        rutas.nombre = $scope.item.nombre;
        rutas.tipo = $scope.item.tipo;
        rutas.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        rutasModel.findById($scope.item._id);
        rutasModel.nombre = $scope.item.nombre;
        rutasModel.tipo = $scope.item.tipo;
        rutasModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])
.controller('modalrutasDeleteController',
  ['$scope', '$uibModalInstance', 'item',
  function ($scope, $uibModalInstance, item) {
    $scope.item = item;
    $scope.ok = function () {
      $uibModalInstance.close($scope.item);
    };
    $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };
}])

.controller('marcasController',
  ['$rootScope','$scope', '$location', 'marcasModel','$uibModal',
  function ($rootScope,$scope, $location, marcasModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'marcas';
    $scope.preloader = true;
    $scope.msjAlert = false;
    marcasModel.getAll().then(function(data) {
      $scope.marcasList = data;
      $scope.marcasTemp = angular.copy($scope.marcasList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/marcas/modalCreate.html',
        controller: 'modalmarcasCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.marcasList.push(data);
           $scope.marcasTemp = angular.copy($scope.marcasList);
        }
      },function(result){
      $scope.marcasList = $scope.marcasTemp;
      $scope.marcasTemp = angular.copy($scope.marcasList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/marcas/modalDelete.html',
      controller: 'modalmarcasDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.marcasList.indexOf(data);
      $scope.marcasList.splice(idx, 1);
      marcasModel
        .destroy(data._id)
        .then(function(result) {
          $scope.msjAlert = true;
          $scope.alert = 'success';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])
.controller('modalmarcasCreateController',
  ['$scope', '$uibModalInstance', 'item','marcasModel','$filter',
  function ($scope, $uibModalInstance, item,marcasModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {marca: $scope.item.marca,modelo: $scope.item.modelo};
        var marcas = marcasModel.create();
        marcas.marca = $scope.item.marca;
        marcas.modelo = $scope.item.modelo;
        marcas.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        marcasModel.findById($scope.item._id);
        marcasModel.marca = $scope.item.marca;
        marcasModel.modelo = $scope.item.modelo;
        marcasModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])
.controller('modalmarcasDeleteController',
  ['$scope', '$uibModalInstance', 'item',
  function ($scope, $uibModalInstance, item) {
    $scope.item = item;
    $scope.ok = function () {
      $uibModalInstance.close($scope.item);
    };
    $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };
}])
.config(function ($routeProvider) {
  $routeProvider
    .when('/marcas', {
      templateUrl: '/templates/marcas/index.html',
      controller: 'marcasController',
      access: {
        restricted: false,
       rol: 4
      }
    });
 })




.controller('modalUserCreateController',
  ['$scope', '$uibModalInstance', 'item','AuthService','userService',
  function ($scope, $uibModalInstance, item,AuthService,userService) {
  
    $scope.item = item;
    $scope.saving = false;
    if(item){
     $scope.tmpUsername = angular.copy(item.username);
    }
     
    $scope.save = function () {

      if(!item){
        $scope.saving = true;
        item = {username:$scope.item.username,rol:$scope.item.rol,flat:true};
        AuthService.register($scope.item.username,$scope.item.password,$scope.item.rol).then(function(r){
          $scope.saving = false;
        });
      }else{
        userService.editUser($scope.tmpUsername,item.username,$scope.item.password,$scope.item.rol).then(function(r){
          $scope.saving = false;
        });
      }
      $uibModalInstance.close(item);
    };

}])

.controller('modalUserDeleteController',
  ['$scope', '$modalInstance', 'item',
  function ($scope, $modalInstance, item) {
    
  $scope.item = item;
  $scope.ok = function () {
    $modalInstance.close($scope.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
    

}])
.controller('userController',
  ['$rootScope','$scope', '$location', 'userService','$timeout','$uibModal','UsersModel',
  function ($rootScope,$scope, $location, userService,$timeout,$uibModal,UsersModel) {
    $scope.titleLoginController = "MEAN-CASE SUPER HEROIC";
    $rootScope.titleWeb = "Users";
    $scope.preloader = true;
    $scope.msjAlert = false;
    UsersModel.getAll().then(function(data){
            $scope.usersList = data; 
            $scope.usersTemp = angular.copy($scope.usersList);
            $scope.preloader = false;
    })
    /*  Modal*/

    /*  Create    */
     $scope.open = function (size,item) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'templates/users/modalUserCreate.html',
          controller: 'modalUserCreateController',
          size: size,
          resolve: {
            item: function () {
              return item;
            }
          }
        });

        modalInstance.result.then(function(data) {
          if(!data._id) {
         
                $scope.usersList.push(data); 
                $scope.usersTemp = angular.copy($scope.usersList);
            }      
        },function(result){
          $scope.usersList = $scope.usersTemp;
          $scope.usersTemp = angular.copy($scope.usersList);  
        });
    };

    /*  Create    */
    /*  Delete    */
    $scope.openDelete = function (size,item) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'templates/users/modalUserDelete.html',
          controller: 'modalUserDeleteController',
          size: size,
          resolve: {
            item: function () {
              return item;
            }
          }
        });

        modalInstance.result.then(function(data) { 
          var idx = $scope.usersList.indexOf(data); 
          $scope.usersList.splice(idx, 1);
          userService
            .deleteUser(data._id)
            .then(function(result) {
                $scope.msjAlert = true;
                $scope.alert = "success";
                $scope.message = result.message;
            })
            .catch(function(err) {
                //error
                $scope.msjAlert = true;
                $scope.alert = "danger";
                $scope.message = "Error "+err;
            })            
        });
    };

    /*  Delete    */

    /*  Modal*/

    /*    Configuration Watch  Change Serch    */
         /* $scope.filterText = '';
          // Instantiate these variables outside the watch
          var tempFilterText = '',
          filterTextTimeout;
          $scope.$watch('searchText', function (val) {
              if (filterTextTimeout) $timeout.cancel(filterTextTimeout);
              tempFilterText = val;
              filterTextTimeout = $timeout(function() {
                  $scope.filterText = tempFilterText;
              }, 1500); // delay 250 ms
          })*/
    /*    Configuration Watch Change Serch     */
        

}])
