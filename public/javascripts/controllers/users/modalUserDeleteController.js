.controller('modalUserDeleteController',
  ['$scope', '$modalInstance', 'item',
  function ($scope, $modalInstance, item) {
    
  $scope.item = item;
  $scope.ok = function () {
    $modalInstance.close($scope.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
    

}])