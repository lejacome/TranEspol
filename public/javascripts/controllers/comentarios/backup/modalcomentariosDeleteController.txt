.controller('modalcomentariosDeleteController',
  ['$scope', '$uibModalInstance', 'item',
  function ($scope, $uibModalInstance, item) {
    $scope.item = item;
    $scope.ok = function () {
      $uibModalInstance.close($scope.item);
    };
    $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };
}])