.controller('AuditController',
  ['$rootScope','$scope', '$location', 'AuditService','$uibModal',
  function ($rootScope,$scope, $location, AuditService,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'Audit';
    $scope.preloader = true;
    $scope.msjAlert = false;
    AuditService.allAudit().then(function(data) {
      $scope.AuditList = data;
      $scope.AuditTemp = angular.copy($scope.AuditList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/Audit/modalCreate.html',
        controller: 'modalAuditCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.AuditList.push(data);
           $scope.AuditTemp = angular.copy($scope.AuditList);
        }
      },function(result){
      $scope.AuditList = $scope.AuditTemp;
      $scope.AuditTemp = angular.copy($scope.AuditList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/Audit/modalDelete.html',
      controller: 'modalAuditDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.AuditList.indexOf(data);
      $scope.AuditList.splice(idx, 1);
      AuditService
        .del(data._id)
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