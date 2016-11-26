.config(function ($routeProvider) {
  $routeProvider
    .when('/posicionbus', {
      templateUrl: '/templates/posicionbus/index.html',
      controller: 'posicionbusController',
      access: {
        restricted: false,
       rol: 4
      }
    });
 })