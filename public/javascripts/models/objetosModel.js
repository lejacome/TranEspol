.service('objetosModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/objetos';
  model.constructorModel = ["nombre","descripcion","imagen"];
  return model;
})