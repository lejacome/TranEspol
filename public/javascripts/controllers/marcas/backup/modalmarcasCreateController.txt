.controller('modalmarcasCreateController',
  ['$scope', '$uibModalInstance', 'item','marcasModel','$filter',
  function ($scope, $uibModalInstance, item,marcasModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {marca: $scope.item.marca,modelo: $scope.item.modelo};
        var marcas = marcasModel.create();
        marcas.marca = $scope.item.marca;
        marcas.modelo = $scope.item.modelo;
        marcas.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        marcasModel.findById($scope.item._id);
        marcasModel.marca = $scope.item.marca;
        marcasModel.modelo = $scope.item.modelo;
        marcasModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])