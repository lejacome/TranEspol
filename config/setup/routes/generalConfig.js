var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ModelGeneralConfig = mongoose.model('ModelGeneralConfig');

router.get('/confiGeneral', function (req, res, next) {
	ModelGeneralConfig.find(function (err, models) {
		if (err) {
			return next(err)
		}
		res.json(models)
	})
});

router.post('/confiGeneral', function (req, res, next) {
	var confiGeneral = new ModelGeneralConfig(req.body);
	confiGeneral.save(function (err, confiGeneral) {
		if (err) {
			return next(err)
		}
		res.json(confiGeneral);
	})
})

module.exports = router;