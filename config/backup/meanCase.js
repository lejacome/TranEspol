//Compress File by project export
(function(meanCase){
	  var mongoose = require('mongoose');
	  var Audit = mongoose.model('Audit');
	  
	  meanCase.auditSave = function(req,action,scheme_affected,detail){
	  	var ip = req.headers['x-forwarded-for'] || 
	    req.connection.remoteAddress || 
	    req.socket.remoteAddress ||
	    req.connection.socket.remoteAddress; 
	  	var date = new Date();
		var current_hour = date.getHours();
		var user = "";
	    var model = new Audit();
	    if(req.session.name)
	    	user = req.session.name;
	    else
	    	user = "Register";
	    model.user = user;
	    model.hostname = req.headers.host;
	    model.ip = ip;
	    model.action = action;
	    model.scheme_affected = scheme_affected;
	    model.detail = detail;
	    model.date = date;
	    model.hour = current_hour + ':' + date.getMinutes();
	    model.save();
	  };
	  
	  return meanCase;
})(typeof exports === "undefined" ? meanCase = {} : exports);