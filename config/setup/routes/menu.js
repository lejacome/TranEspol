var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ModelMenu = mongoose.model('ModelMenu');

router.get('/menu', function (req, res, next) {
	ModelMenu.find(function (err, models) {
		if (err) {
			return next(err)
		}
		res.json(models)
	})
});

router.post('/menu', function (req, res, next) {
	var menu = new ModelMenu(req.body);
	menu.save(function (err, menu) {
		if (err) {
			return next(err)
		}
		res.json(menu);
	})
})

module.exports = router;