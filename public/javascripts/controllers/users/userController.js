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