.factory('AuditService',
  ['$q', '$http',
  function ($q, $http) {
    return ({
      allAudit: allAudit,
      create: create,
      del : del,
      edit   : edit
    });
    function allAudit () {
      var defered = $q.defer();
      var promise = defered.promise;
      $http.get('/api/Audit')
        .success(function(data) {
          defered.resolve(data);
        })
        .error(function(err) {
          defered.reject(err)
        });
      return promise;
    }
    function del (id) {
      var defered = $q.defer();
      var promise = defered.promise;
      $http.delete('/api/Audit/' + id)
        .success(function(data) {
           defered.resolve(data);
        })
        .error(function(err) {
          defered.reject(err)
        });
      return promise;
    }
    function create(user,hostname,ip,action,scheme_affected,detail,date,hour) {
      var deferred = $q.defer();
       $http.post('/api/Audit', {user: user,hostname: hostname,ip: ip,action: action,scheme_affected: scheme_affected,detail: detail,date: date,hour: hour})
        .success(function (data, status) {
          deferred.resolve(data);
       })
        .error(function (data) {
          deferred.reject(data);
        });
      return deferred.promise;
    }
    function edit(user,hostname,ip,action,scheme_affected,detail,date,hour,id) {
      var deferred = $q.defer();
       $http.put('/api/Audit/'+id, {user: user,hostname: hostname,ip: ip,action: action,scheme_affected: scheme_affected,detail: detail,date: date,hour: hour})
        .success(function (data, status) {
          deferred.resolve(data);
        })
        .error(function (data) {
          deferred.reject(data);
        });
      return deferred.promise;
    }
}])