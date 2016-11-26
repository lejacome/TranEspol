.config(function ($routeProvider) {
  $routeProvider
    .when('/bus', {
      templateUrl: '/templates/bus/index.html',
      controller: 'busController',
      access: {
        restricted: false,
       rol: 4
      }
    });
 })