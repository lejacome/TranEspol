.service('horariosModel', function ($optimumModel,busModel,conductorsModel,rutasModel,rutasModel) {
  var model = new $optimumModel();
  model.url = '/api/horarios';
  model.constructorModel = ["bus","conductors","rutas","rutas","idruta","idbus","idconductor","fecha","hora"];
 model.dependencies = {bus:busModel.url,conductors:conductorsModel.url,rutas:rutasModel.url,rutas:rutasModel.url};
  return model;
})