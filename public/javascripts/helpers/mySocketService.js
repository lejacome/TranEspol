.factory('mySocket', function (socketFactory) {
      var socket = socketFactory();
      socket.forward('chat message');
      socket.forward('test');
      return socket;
})