var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var filter = require('../../helpers/filters.js');
var taskProject = require('../../helpers/taskProject.js');
var shell = require('shelljs');
var ModelSchema = mongoose.model('ModelSchema');
var tmpModels = require('../../tmpModels.js');
router.post('/projectProduction', function(req, res, next) {

	taskProject.removeReciduos(req.body.models,function(valid,err){
		if(valid){
			taskProject.createProject(req.body.projectName,req.body.authorName,req.body.email,req.body.license,req.body.models,req.body.template,function(valid,err){
		 	if(valid){
		 		res.json({valid:valid});
		 	}else{
		 		res.json({valid:valid,err:err});	
		 	}
		});	
		}else{
			 res.json({valid:valid,err:err});
		}

	});

});

module.exports = router;