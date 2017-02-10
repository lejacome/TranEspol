.service('comentariosModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/comentarios';
  model.constructorModel = ["nombre","descripcion"];
  return model;
})