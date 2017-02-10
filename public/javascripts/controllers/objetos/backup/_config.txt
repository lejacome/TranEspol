.config(function ($routeProvider) {
  $routeProvider
    .when('/objetos', {
      templateUrl: '/templates/objetos/index.html',
      controller: 'objetosController',
      access: {
        restricted: true,
       rol: 1
      }
    });
 })