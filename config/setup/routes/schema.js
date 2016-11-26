var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ModelSchema = mongoose.model('ModelSchema');

router.get('/schema', function (req, res, next) {
	ModelSchema.find(function (err, models) {
		if (err) {
			return next(err)
		}
		res.json(models)
	})
});

router.post('/schema', function (req, res, next) {
	var menu = new ModelSchema(req.body);
	menu.save(function (err, menu) {
		if (err) {
			return next(err)
		}
		res.json(menu);
	})
});

router.post('/schema/fields', function (req, res) {
	var array = [];
	var tmp   = '';
	/*req.body.model1 = 'Users';
	req.body.model2 = 'pruebas';*/
	var model1 = req.body.model1;
	var model2 = req.body.model2;
	var Model1 = mongoose.model(req.body.model1);
	var Model2 = mongoose.model(req.body.model2);
	for (var i = 1; i <= 2; i++) {
		tmp = 'Model'+i;
		eval(tmp).schema.eachPath(function(path) {
			if(path != "__v" ){
				if(path != "hash" ){
					if(path != "salt" ){
						array.push({model : tmp,name : path});
					}
				}
			}
		});
		
	};
	
	res.send(array)
});

module.exports = router;