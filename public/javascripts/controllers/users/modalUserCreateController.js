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
