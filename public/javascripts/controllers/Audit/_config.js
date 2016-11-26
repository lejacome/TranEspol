.config(function ($routeProvider) {
  $routeProvider
    .when('/Audit', {
      templateUrl: '/templates/Audit/auditIndex.html',
      controller: 'AuditController',
      access: {
        restricted: false,
       rol: 4
      }
    });
 })