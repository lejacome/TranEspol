var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ModelRelationship = mongoose.model('ModelRelationship');

router.get('/relationship', function (req, res, next) {
	ModelRelationship.find(function (err, models) {
		if (err) {
			return next(err)
		}
		res.json(models)
	})
});

router.post('/relationship', function (req, res, next) {
	var relationship = new ModelRelationship(req.body);
	relationship.save(function (err, relationship) {
		if (err) {
			return next(err)
		}
		res.json(relationship);
	})
});

/* DELETE - relationship. */
router.delete('/relationship/:id', function(req, res){
   ModelRelationship.findByIdAndRemove(req.params.id, function(err){
     if(err){res.json(false);}
     res.json(true);
   })
});

router.post('/countOneToMany', function (req, res, next) {
	var arg = req.body.arg,cont = 0;
	ModelRelationship.find(function (err, models) {
		if (err) {
			return next(err)
		}
		if(models.length > 0){
			for(var x in models){
				if(models[x].modelB == arg)
					cont++;
			}
			
		}else{
			cont = 0;
		}
		res.json(cont);
	})
});

router.post('/existRelation', function (req, res, next) {
	var arg = req.body.arg,arg2 =req.body.arg2,cont = 0;
	var relationship = [];
	var existRelation = [];
	ModelRelationship.find(function (err, models) {
		if (err) {
			return next(err)
		}
		if(models.length > 0){
			for(var x in models){
				if((models[x].modelA == arg && models[x].modelB == arg2) ||  (models[x].modelA == arg2 && models[x].modelB == arg)){
					cont++;
					existRelation.push({modelA:models[x].modelA,cardinalitie:models[x].cardinalitie,modelB:models[x].modelB});
				}
				if(models[x].modelB == arg2){
					relationship.push({_id:models[x]._id,modelA:models[x].modelA,cardinalitie:models[x].cardinalitie,modelB:models[x].modelB});
				}
			}
			
		}else{
			cont = 0;
		}
		res.json({cont:cont,relationship:relationship,existRelation:existRelation});
	})
});



module.exports = router;