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