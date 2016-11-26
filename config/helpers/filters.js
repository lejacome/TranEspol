(function(filters){
	var loginAccessRoutes = require('../../helpers/loginAccessRoutes.js');
	filters.root = function(rol, callback){
			 if (rol) {
			 	if (rol >= 5) {
			 		return callback(true);
			 	}else{
			 		return callback(false,'Sorry you do not have access to this route');	
			 	}
			 }else{
			 		return callback(false,'Sorry you do not have access to this route');	
			 }	  		
	};
	filters.admin = function(rol, callback){
			 if (rol) {
			 	if (rol >= 4) {
			 		return callback(true);
			 	}else{
			 		return callback(false,'Sorry you do not have access to this route');	
			 	}
			 }else{
			 		return callback(false,'Sorry you do not have access to this route');	
			 }	  		
	};
	filters.coordinator = function(rol, callback){
			 if (rol) {
			 	if (rol >= 3) {
			 		return callback(true);
			 	}else{
			 		return callback(false,'Sorry you do not have access to this route');	
			 	}
			 }else{
			 		return callback(false,'Sorry you do not have access to this route');	
			 }	  		
	};
	filters.edit = function(rol, callback){
			 if (rol) {
			 	if (rol >= 2) {
			 		return callback(true);
			 	}else{
			 		return callback(false,'Sorry you do not have access to this route');	
			 	}
			 }else{
			 		return callback(false,'Sorry you do not have access to this route');	
			 }	  		
	};
	filters.reader = function(rol, callback){
			 if (rol) {
			 	if (rol >= 1) {
			 		return callback(true);
			 	}else{
			 		return callback(false,'Sorry you do not have access to this route');	
			 	}
			 }else{
			 		return callback(false,'Sorry you do not have access to this route');	
			 }	  		
	};

	var stringRequest = function(arrayRoutes){
		 string = ''; 
		 for(var i in arrayRoutes){
		 	 pos = arrayRoutes[i].indexOf(":");
		 	 if(pos != -1 ){
		 	 	 arrayMethods = arrayRoutes[i].split(':');
		 	 	 string += "(req.url == '"+arrayMethods[0]+"' && req.method == '"; 	
			 	 string += arrayMethods[1];
			 	 string += "') || ";
		 	 }else{
		 	 	string += "req.url == '"+arrayRoutes[i]+"' || ";
		 	 }
		 	 
		 }
		 return string.slice(0,-3); 

	}

	filters.isLogin = function(req, callback){
			 arrayNoLoginRoutes = loginAccessRoutes.noLoginRoutes.split('|');
			 stringNoLoginRoutes = stringRequest(arrayNoLoginRoutes);
			 isValid = 0;
			 if (req.session.rol || req.url == '/setup/setValues' || req.url == '/setup/layouts' || req.url == '/setup/home' || req.url == '/api/menu' || req.url == '/api/logout' || req.url == '/' || req.url == '/api/login' || req.url == '/cookie' || eval(stringNoLoginRoutes)) {
			 		 isValid = 0;	 
			 }else{
			 		 isValid++;	
			 }
			 var msg = 'Sorry you do not have access to this route please login!';
			 var isValidFilter = 0;
			 arrayIsRoot = loginAccessRoutes.isRoot.split('|');
			 stringIsRoot = stringRequest(arrayIsRoot);
			 if(eval(stringIsRoot)){
			 	if(req.session.rol < 5 || !req.session.rol){
			 		 msg = 'You do not have access to this route its role should be root';
			 		 isValidFilter++;
			 	}
			 }
			 arrayIsAdmin = loginAccessRoutes.isAdmin.split('|');
			 stringIsAdmin = stringRequest(arrayIsAdmin);
			 if(eval(stringIsAdmin)){
			 	if(req.session.rol < 4 || !req.session.rol){
			 		 msg = 'You do not have access to this route its role should be admin';
			 		 isValidFilter++;
			 	}
			 }

			 arrayIsCoordinator = loginAccessRoutes.isCoordinator.split('|');
			 stringIsCoordinator = stringRequest(arrayIsCoordinator);
			 if(eval(stringIsCoordinator)){
			 	if(req.session.rol < 3 || !req.session.rol){
			 		 msg = 'You do not have access to this route its role should be cordinador';
			 		 isValidFilter++;
			 	}
			 }

			 arrayIsEdit = loginAccessRoutes.isEdit.split('|');
			 stringIsEdit = stringRequest(arrayIsEdit);
			 if(eval(stringIsEdit)){
			 	if(req.session.rol < 2|| !req.session.rol){
			 		 msg = 'You do not have access to this route its role should be edit';
			 		 isValidFilter++;
			 	}
			 }

			 arrayIsReader = loginAccessRoutes.isReader.split('|');
			 stringIsReader = stringRequest(arrayIsReader);
			 if(eval(stringIsReader)){
			 	if(req.session.rol < 1 || !req.session.rol){
			 		 msg = 'You do not have access to this route its role should be reader';
			 		 isValidFilter++;
			 	}
			 }
			 
			 if(isValid == 0 && isValidFilter == 0){
			 	return callback(true);
			 }else{ 
			 	return callback(false,msg);
			 }		
	};

})(typeof exports === "undefined" ? filters = {} : exports);
