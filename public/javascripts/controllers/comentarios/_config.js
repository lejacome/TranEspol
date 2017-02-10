.config(function ($routeProvider) {
  $routeProvider
    .when('/comentarios', {
      templateUrl: '/templates/comentarios/index.html',
      controller: 'comentariosController',
      access: {
        restricted: true,
       rol: 1
      }
    });
 })