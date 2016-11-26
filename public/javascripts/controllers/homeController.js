.controller('homeController',
  ['$rootScope','$scope', '$location', 'AuthService','$uibModal','mySocket',
  function ($rootScope,$scope, $location, AuthService,$uibModal,mySocket) {
    $scope.arrayMsg = [];
    $scope.titleHomeController = "Welcome";
    $scope.testSocket = function(){
    	mySocket.emit('chat message',{user:$rootScope.user.username,input:$scope.msgInput});
    	mySocket.emit('test', 'test test');
      
    }
    $scope.$on('socket:chat message', function(event, data) {
      
      var size = $scope.arrayMsg.length;
      console.log(size);
      if(size > 0){
        var oldUser = $scope.arrayMsg[size-1].user;
        var newUser = data.user;
        if(oldUser =! newUser){
          data["class1"] = "amigo";
          data["class2"] = "derecha";
        }else{
          data["class1"] = "autor";
          data["class2"] = "izquierda";
        }
         
       
      }else{
        data["class1"] = "autor";
        data["class2"] = "izquierda";
      }
      $scope.arrayMsg.push(data);
      $scope.msgInput = '';
      window.setInterval(function() {
        var elem = document.getElementById('mensajes');
        elem.scrollTop = elem.scrollHeight;
      }, 5000);
        
    });
    $scope.$on('socket:test', function(event, data) {
    	console.log(data);
    });
}])