.factory('userService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    

    // return available functions for use in controller
    return ({
      allUsers: allUsers,
      deleteUser : deleteUser,
      editUser   : editUser
    });


    function allUsers () {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('/api/users')
            .success(function(data) {
                defered.resolve(data);
            })
            .error(function(err) {
                defered.reject(err)
            });

        return promise;
    }

    function deleteUser (id) {
      var defered = $q.defer();
      var promise = defered.promise;
      $http.delete('/api/users/' + id)
        .success(function(data) {
                defered.resolve(data);
            })
            .error(function(err) {
                defered.reject(err)
            });

        return promise;
    }

   function editUser(username,newUsername, password,rol) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.put('/api/register', {username: username,newUsername: newUsername, password: password,rol:rol})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }





    }])