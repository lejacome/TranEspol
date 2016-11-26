(function(taskProject){
	var fs = require('fs-extra');
	var fss = require('fs');
	var replace = require("replace");
	var mongoose = require('mongoose');
	var shell = require('shelljs');
	var ModelSchema = mongoose.model('ModelSchema');
	var ModelMenu = mongoose.model('ModelMenu');
	var ModelRelationship = mongoose.model('ModelRelationship');

	taskProject.removeReciduos = function(models,callback){
		var models = models.split(',');
		for (var i = 0; i < models.length; i++) {
			mongoose.connection.db.dropCollection(models[i], function(err, result) {
					if (err) return callback(false,err);
			});				 
		}	
		//Drop Collections Model Menu
		ModelMenu.remove({}, function(err, result) {
			if (err) return callback(false,err);
			ModelSchema.remove({}, function(err, result) {
				if (err) return callback(false,err);
				ModelRelationship.remove({}, function(err, result) {
					if (err) return callback(false,err);
					//Insert Schema Menu
			        var schema = new ModelSchema();
			        schema.name = 'Users';
			        schema.save(function(err){
			        	if (err) return callback(false,err);
			        	return callback(true);
			        });			       
					
				});
				
			});

		});
        

	}


	taskProject.createProject = function(projectName,authorName,email,license,models,mask,callback){
		var wsTmpModels = fs.createOutputStream('config/tmpModels.js');
		wsTmpModels.write("var tmpModels = {models:'"+models+"',projectName:'"+projectName+"',authorName:'"+authorName+"',email:'"+email+"',license:'"+license+"',mask:'"+mask+"'};\nmodule.exports = tmpModels;");
		callback(true);									
	}

})(typeof exports === "undefined" ? taskProject = {} : exports);
