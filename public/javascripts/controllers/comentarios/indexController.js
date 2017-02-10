.controller('comentariosController',
  ['$rootScope','$scope', '$location', 'comentariosModel','$uibModal',
  function ($rootScope,$scope, $location, comentariosModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'comentarios';
    $scope.preloader = true;
    $scope.msjAlert = false;
    comentariosModel.getAll().then(function(data) {
      $scope.comentariosList = data;
      $scope.comentariosTemp = angular.copy($scope.comentariosList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/comentarios/modalCreate.html',
        controller: 'modalcomentariosCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.comentariosList.push(data);
           $scope.comentariosTemp = angular.copy($scope.comentariosList);
        }
      },function(result){
      $scope.comentariosList = $scope.comentariosTemp;
      $scope.comentariosTemp = angular.copy($scope.comentariosList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/comentarios/modalDelete.html',
      controller: 'modalcomentariosDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.comentariosList.indexOf(data);
      $scope.comentariosList.splice(idx, 1);
      comentariosModel
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