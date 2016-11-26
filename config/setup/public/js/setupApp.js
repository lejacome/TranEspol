var myApp = angular.module('setupApp', ['ngBootbox']);

myApp.controller('setupAppController', ['$scope', 'setupInitService', '$ngBootbox','$window', function ($scope, setupInitService, $ngBootbox,$window) {
    $scope.templateClass = false;
    $scope.submitBtn = true;
    $scope.re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    $scope.ve = true;
    $scope.msjAlert = false;
    $scope.validate = function () {
        if(!$scope.projectName || !$scope.authorName || !$scope.username || !$scope.password || !$scope.passwordConfirm || !$scope.ve || ($scope.password != $scope.passwordConfirm) || !$scope.template){
            $scope.submitBtn = true;
        }else{
            $scope.submitBtn = false;
        }
    };

    $scope.dataTypes = [
                            {
                                id: 1,
                                name: 'Scalable project'
                            },
                            {
                                id: 2,
                                name: 'Prototype projects'
                            }
                        ];

    $scope.valEmail = function(){
        $scope.ve = $scope.re.test($scope.email);
        //console.log($scope.ve)
        $scope.validate();
    }

    setupInitService.allLayouts().then(function (data) {
        $scope.layouts = data;
    });

    $scope.selectTemplate = function (layout, index) {
        $scope.template = layout;
        $scope.index = index;
        $scope.validate();
    };

    $scope.setupConfig = function () {
        setupInitService.setValues($scope.projectName,$scope.username,$scope.password,$scope.email,$scope.template.label,$scope.authorName,$scope.item.dataType.id).then(function(result){
            console.log(result);
            if(result == true){
                $window.location.reload();
            }else{
               $scope.msjAlert = true; 
               $scope.message = "An error has ocurred!";
            }
        });
    };

}]);

myApp.factory('setupInitService',
    ['$q', '$http',
        function ($q, $http) {
            return ({
                allLayouts: allLayouts,
                setValues : setValues
            });

            function allLayouts() {
                var defered = $q.defer();
                var promise = defered.promise;

                $http.get('/setup/layouts')
                    .success(function (data) {
                        defered.resolve(data);
                    })
                    .error(function (err) {
                        defered.reject(err)
                    });

                return promise;
            }

            function setValues(projectName,username,password,email,template,authorName,projectType) {
              var deferred = $q.defer();
              $http.post('/setup/setValues', {projectName: projectName,username: username, password: password,email:email,template:template,authorName:authorName,projectType:projectType})
                .success(function (data, status) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                  deferred.reject();
                });
                return deferred.promise;

            }






}]);