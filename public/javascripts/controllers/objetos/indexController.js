.controller('objetosController',
  ['$rootScope','$scope', '$location', 'objetosModel','$uibModal',
  function ($rootScope,$scope, $location, objetosModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'objetos';
    $scope.preloader = true;
    $scope.msjAlert = false;
    objetosModel.getAll().then(function(data) {
      $scope.objetosList = data;
      $scope.objetosTemp = angular.copy($scope.objetosList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/objetos/modalCreate.html',
        controller: 'modalobjetosCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.objetosList.push(data);
           $scope.objetosTemp = angular.copy($scope.objetosList);
        }
      },function(result){
      $scope.objetosList = $scope.objetosTemp;
      $scope.objetosTemp = angular.copy($scope.objetosList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/objetos/modalDelete.html',
      controller: 'modalobjetosDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.objetosList.indexOf(data);
      $scope.objetosList.splice(idx, 1);
      objetosModel
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