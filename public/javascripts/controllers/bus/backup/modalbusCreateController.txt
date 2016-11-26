.controller('modalbusCreateController',
  ['$scope', '$uibModalInstance', 'item','busModel','$filter',
  function ($scope, $uibModalInstance, item,busModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {ndisco: $scope.item.ndisco,marca: $scope.item.marca,placa: $scope.item.placa,modelo: $scope.item.modelo,csentados: $scope.item.csentados,cparados: $scope.item.cparados};
        var bus = busModel.create();
        bus.ndisco = $scope.item.ndisco;
        bus.marca = $scope.item.marca;
        bus.placa = $scope.item.placa;
        bus.modelo = $scope.item.modelo;
        bus.csentados = $scope.item.csentados;
        bus.cparados = $scope.item.cparados;
        bus.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        busModel.findById($scope.item._id);
        busModel.ndisco = $scope.item.ndisco;
        busModel.marca = $scope.item.marca;
        busModel.placa = $scope.item.placa;
        busModel.modelo = $scope.item.modelo;
        busModel.csentados = $scope.item.csentados;
        busModel.cparados = $scope.item.cparados;
        busModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])