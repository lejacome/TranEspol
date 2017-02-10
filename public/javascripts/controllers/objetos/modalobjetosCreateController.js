.controller('modalobjetosCreateController',
  ['$scope', '$uibModalInstance', 'item','objetosModel','$filter',
  function ($scope, $uibModalInstance, item,objetosModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {nombre: $scope.item.nombre,descripcion: $scope.item.descripcion,imagen: $scope.item.imagen};
        var objetos = objetosModel.create();
        objetos.nombre = $scope.item.nombre;
        objetos.descripcion = $scope.item.descripcion;
        objetos.imagen = $scope.item.imagen;
        objetos.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        objetosModel.findById($scope.item._id);
        objetosModel.nombre = $scope.item.nombre;
        objetosModel.descripcion = $scope.item.descripcion;
        objetosModel.imagen = $scope.item.imagen;
        objetosModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])