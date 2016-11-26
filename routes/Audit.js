var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Audit = mongoose.model('Audit');
var meanCaseBase = require('../config/helpers/meanCaseBase.js');
/* GET Audit listing. */
router.get('/Audit', function(req, res, next) {
	//meanCaseBase.filter.admin(req.session.rol,function(valid,warningMessage){
		//if(!valid){return next(res.json({warningMessage:warningMessage}));}
		   Audit.find(function(err, models){
		     if(err){return next(err)}
		     res.json(models)
		   })
    //})
});
module.exports = router;