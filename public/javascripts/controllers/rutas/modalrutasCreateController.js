.controller('modalrutasCreateController',
  ['$scope', '$uibModalInstance', 'item','rutasModel','$filter',
  function ($scope, $uibModalInstance, item,rutasModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {nombre: $scope.item.nombre,tipo: $scope.item.tipo,ruta:$scope.item.ruta};
        var rutas = rutasModel.create();
        rutas.nombre = $scope.item.nombre;
        rutas.tipo = $scope.item.tipo;
        rutas.ruta = $scope.item.ruta
        rutas.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        rutasModel.findById($scope.item._id);
        rutasModel.nombre = $scope.item.nombre;
        rutasModel.tipo = $scope.item.tipo;
        rutasModel.ruta = $scope.item.ruta;
        rutasModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])
