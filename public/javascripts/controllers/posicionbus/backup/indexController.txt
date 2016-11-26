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