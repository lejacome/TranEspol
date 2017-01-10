.service('busModel', function ($optimumModel,marcasModel) {
  var model = new $optimumModel();
  model.url = '/api/bus';
  model.constructorModel = ["marcas","disco","placa","csentados","cparados"];
 model.dependencies = {marcas:marcasModel.url};
  return model;
})