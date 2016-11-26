.service('busModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/bus';
  model.constructorModel = ["ndisco","marca","placa","modelo","csentados","cparados"];
  return model;
})