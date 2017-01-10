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
           busModel.getAll().then(function(d) {
             $scope.busList = d;
             $scope.busTemp = angular.copy($scope.busList);
           });
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