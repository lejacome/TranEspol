.config(function ($routeProvider) {
  $routeProvider
    .when('/horarios', {
      templateUrl: '/templates/horarios/index.html',
      controller: 'horariosController',
      access: {
        restricted: false,
       rol: 4
      }
    });
 })