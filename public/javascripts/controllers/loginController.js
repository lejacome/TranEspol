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