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