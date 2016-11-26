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