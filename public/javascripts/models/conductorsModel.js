.service('conductorsModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/conductors';
  model.constructorModel = ["nombre","cedula"];
  return model;
})