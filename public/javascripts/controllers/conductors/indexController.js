.controller('conductorsController',
  ['$rootScope','$scope', '$location', 'conductorsModel','$uibModal',
  function ($rootScope,$scope, $location, conductorsModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'conductors';
    $scope.preloader = true;
    $scope.msjAlert = false;
    conductorsModel.getAll().then(function(data) {
      $scope.conductorsList = data;
      $scope.conductorsTemp = angular.copy($scope.conductorsList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/conductors/modalCreate.html',
        controller: 'modalconductorsCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.conductorsList.push(data);
           $scope.conductorsTemp = angular.copy($scope.conductorsList);
        }
      },function(result){
      $scope.conductorsList = $scope.conductorsTemp;
      $scope.conductorsTemp = angular.copy($scope.conductorsList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/conductors/modalDelete.html',
      controller: 'modalconductorsDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.conductorsList.indexOf(data);
      $scope.conductorsList.splice(idx, 1);
      conductorsModel
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