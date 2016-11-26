.config(function ($routeProvider) {
  $routeProvider
    .when('/conductors', {
      templateUrl: '/templates/conductors/index.html',
      controller: 'conductorsController',
      access: {
        restricted: false,
       rol: 4
      }
    });
 })