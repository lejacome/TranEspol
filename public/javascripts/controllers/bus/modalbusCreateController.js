.controller('modalbusCreateController',
  ['$scope', '$uibModalInstance', 'item','busModel','$filter',"marcasModel",
  function ($scope, $uibModalInstance, item,busModel,$filter,marcasModel) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {disco: $scope.item.disco,placa: $scope.item.placa,csentados: $scope.item.csentados,cparados: $scope.item.cparados};
        var bus = busModel.create();
        bus.marcas = $scope.item.marcas;
        bus.disco = $scope.item.disco;
        bus.placa = $scope.item.placa;
        bus.csentados = $scope.item.csentados;
        bus.cparados = $scope.item.cparados;
        bus.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        busModel.findById($scope.item._id);
        busModel.marcas =  $scope.item.marcas;
        busModel.disco = $scope.item.disco;
        busModel.placa = $scope.item.placa;
        busModel.csentados = $scope.item.csentados;
        busModel.cparados = $scope.item.cparados;
        busModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
    marcasModel.getAll().then(function(data) {
      $scope.marcas = data;
    });
}])