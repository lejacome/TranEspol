.config(function ($routeProvider) {
  $routeProvider
    .when('/rutas', {
      templateUrl: '/templates/rutas/index.html',
      controller: 'rutasController',
      access: {
        restricted: false,
       rol: 4
      }
    });
 })