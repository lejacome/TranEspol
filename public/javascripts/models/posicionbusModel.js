.service('posicionbusModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/posicionbus';
  model.constructorModel = ["idbus","fecha","latitud","longitud"];
  return model;
})