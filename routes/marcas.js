var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var marcas = mongoose.model('marcas');
router.get('/marcas/:id', function (req, res) {
  marcas.findById(req.params.id, function (err, data) {
    res.json(data);
  })
})
/* GET marcas listing. */
router.get('/marcas', function(req, res, next) {
   marcas.find(function(err, models){
     if(err){return next(err)}
     res.json(models)
     meanCaseBase.auditSave(req,'Query all Registers','marcas','Query all Registers');
   })
});
/* POST - Add marcas. */
router.post('/marcas', function(req, res, next){
   var model = new marcas(req.body);
   model.save(function(err, data){
     if(err){return next(err)}
     res.json(data);
     meanCaseBase.auditSave(req,'Insert Register','marcas',data);
   })
});
/* PUT - Update marcas. */
router.put('/marcas/:id', function(req, res){
   marcas.findById(req.params.id, function(err, data){
     if(typeof req.body.marca  != "undefined"){data.marca = req.body.marca;}
     if(typeof req.body.modelo  != "undefined"){data.modelo = req.body.modelo;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','marcas',data);
     })
   })
});
/* DELETE - marcas. */
router.delete('/marcas/:id', function(req, res){
   marcas.findByIdAndRemove(req.params.id, function(err){
     if(err){res.send(err)}
     res.json({message: 'marcas delete successful!'});
     meanCaseBase.auditSave(req,'Delete Register','marcas','Id: '+req.params.id);
   })
});
module.exports = router;