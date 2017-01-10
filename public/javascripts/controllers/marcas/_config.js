.config(function ($routeProvider) {
  $routeProvider
    .when('/marcas', {
      templateUrl: '/templates/marcas/index.html',
      controller: 'marcasController',
      access: {
        restricted: false,
       rol: 4
      }
    });
 })