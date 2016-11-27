.controller('modalhorariosCreateController',
  ['$scope', '$uibModalInstance', 'item','horariosModel','$filter',"busModel","conductorsModel","rutasModel","rutasModel",
  function ($scope, $uibModalInstance, item,horariosModel,$filter,busModel,conductorsModel,rutasModel,rutasModel) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
      item.dateAsString1 = $filter("date")(item.fecha, "yyyy-MM-dd");
      item.dateAsString2 = $filter("date")(item.hora, "HH:mm:ss");
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {fecha: $scope.item.fecha,hora: $scope.item.hora};
        var horarios = horariosModel.create();
        horarios.bus = $scope.item.bus;
        horarios.conductors = $scope.item.conductors;
        horarios.rutas = $scope.item.rutas;
        horarios.fecha = $scope.item.fecha;
        horarios.hora = $scope.item.hora;
        horarios.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        if($scope.item.fecha === undefined){
          $scope.item.fecha = Date.parse(item.dateAsString1);
          $scope.item.fecha = new Date($scope.item.fecha);
          $scope.item.fecha = $scope.item.fecha.setDate($scope.item.fecha.getDate() + 1);
        }
        if($scope.item.hora === undefined){
          $scope.item.hora = item.dateAsString2;
        }
        horariosModel.findById($scope.item._id);
        horariosModel.bus =  $scope.item.bus;
        horariosModel.conductors =  $scope.item.conductors;
        horariosModel.rutas =  $scope.item.rutas;
        horariosModel.fecha = $scope.item.fecha;
        horariosModel.hora = $scope.item.hora;
        horariosModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
    busModel.getAll().then(function(data) {
      $scope.bus = data;
    });
    conductorsModel.getAll().then(function(data) {
      $scope.conductors = data;
    });
    rutasModel.getAll().then(function(data) {
      $scope.rutas = data;
    });
    rutasModel.getAll().then(function(data) {
      $scope.rutas = data;
    });
}])