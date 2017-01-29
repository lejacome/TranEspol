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