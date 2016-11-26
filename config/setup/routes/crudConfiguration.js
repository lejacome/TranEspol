var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ModelCrudConfiguration = mongoose.model('ModelCrudConfiguration');

router.get('/crudConfiguration', function (req, res, next) {
	ModelCrudConfiguration.find(function (err, models) {
		if (err) {
			return next(err)
		}
		res.json(models)
	})
});

router.post('/crudConfiguration', function (req, res, next) {
	var menu = new ModelCrudConfiguration(req.body);
	menu.save(function (err, menu) {
		if (err) {
			return next(err)
		}
		res.json(menu);
	})
});



module.exports = router;