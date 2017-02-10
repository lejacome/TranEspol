.controller('modalcomentariosCreateController',
  ['$scope', '$uibModalInstance', 'item','comentariosModel','$filter',
  function ($scope, $uibModalInstance, item,comentariosModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {nombre: $scope.item.nombre,descripcion: $scope.item.descripcion};
        var comentarios = comentariosModel.create();
        comentarios.nombre = $scope.item.nombre;
        comentarios.descripcion = $scope.item.descripcion;
        comentarios.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        comentariosModel.findById($scope.item._id);
        comentariosModel.nombre = $scope.item.nombre;
        comentariosModel.descripcion = $scope.item.descripcion;
        comentariosModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])