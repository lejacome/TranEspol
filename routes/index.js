var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ModelGeneralConfig = mongoose.model('ModelGeneralConfig');
var settings = require('../config/settings.js');
/* GET home page. */
router.get('/', function(req, res, next) {
	ModelGeneralConfig.find(function (err, models) {
    	if(models == ""){
    		res.redirect(settings.url+"setup/home#firstPage");
    	}else{
    		ModelGeneralConfig.findOne({meanCase:"meancase"}, function (err, data) {
				res.render('views/'+data.template+'/index');
			})
    	}
    })
});

module.exports = router;