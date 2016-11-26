.service('rutasModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/rutas';
  model.constructorModel = ["nombre","tipo"];
  return model;
})