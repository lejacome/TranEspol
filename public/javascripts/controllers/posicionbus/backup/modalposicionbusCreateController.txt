.controller('modalposicionbusCreateController',
  ['$scope', '$uibModalInstance', 'item','posicionbusModel','$filter',
  function ($scope, $uibModalInstance, item,posicionbusModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
      item.dateAsString1 = $filter("date")(item.fecha, "yyyy-MM-dd");
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {idbus: $scope.item.idbus,fecha: $scope.item.fecha,latitud: $scope.item.latitud,longitud: $scope.item.longitud};
        var posicionbus = posicionbusModel.create();
        posicionbus.idbus = $scope.item.idbus;
        posicionbus.fecha = $scope.item.fecha;
        posicionbus.latitud = $scope.item.latitud;
        posicionbus.longitud = $scope.item.longitud;
        posicionbus.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        if($scope.item.fecha === undefined){
          $scope.item.fecha = Date.parse(item.dateAsString1);
          $scope.item.fecha = new Date($scope.item.fecha);
          $scope.item.fecha = $scope.item.fecha.setDate($scope.item.fecha.getDate() + 1);
        }
        posicionbusModel.findById($scope.item._id);
        posicionbusModel.idbus = $scope.item.idbus;
        posicionbusModel.fecha = $scope.item.fecha;
        posicionbusModel.latitud = $scope.item.latitud;
        posicionbusModel.longitud = $scope.item.longitud;
        posicionbusModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])