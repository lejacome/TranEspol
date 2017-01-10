.service('marcasModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/marcas';
  model.constructorModel = ["marca","modelo"];
  return model;
})