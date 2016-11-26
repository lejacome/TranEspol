.controller('modalconductorsCreateController',
  ['$scope', '$uibModalInstance', 'item','conductorsModel','$filter',
  function ($scope, $uibModalInstance, item,conductorsModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {nombre: $scope.item.nombre,cedula: $scope.item.cedula};
        var conductors = conductorsModel.create();
        conductors.nombre = $scope.item.nombre;
        conductors.cedula = $scope.item.cedula;
        conductors.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        conductorsModel.findById($scope.item._id);
        conductorsModel.nombre = $scope.item.nombre;
        conductorsModel.cedula = $scope.item.cedula;
        conductorsModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])