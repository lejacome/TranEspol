var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var horarios = mongoose.model('horarios');
router.get('/horarios/:id', function (req, res) {
  horarios.findById(req.params.id, function (err, data) {
    res.json(data);
  })
})
/* GET horarios listing. */
router.get('/horarios', function(req, res, next) {
   horarios.find(function(err, models){
     if(err){return next(err)}
     res.json(models)
     meanCaseBase.auditSave(req,'Query all Registers','horarios','Query all Registers');
   })
});
/* POST - Add horarios. */
router.post('/horarios', function(req, res, next){
   var model = new horarios(req.body);
   model.save(function(err, data){
     if(err){return next(err)}
     res.json(data);
     meanCaseBase.auditSave(req,'Insert Register','horarios',data);
   })
});
/* PUT - Update horarios. */
router.put('/horarios/:id', function(req, res){
   horarios.findById(req.params.id, function(err, data){
     if(typeof req.body.idruta  != "undefined"){data.idruta = req.body.idruta;}
     if(typeof req.body.idbus  != "undefined"){data.idbus = req.body.idbus;}
     if(typeof req.body.idconductor  != "undefined"){data.idconductor = req.body.idconductor;}
     if(typeof req.body.fecha  != "undefined"){data.fecha = req.body.fecha;}
     if(typeof req.body.hora  != "undefined"){data.hora = req.body.hora;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','horarios',data);
     })
   })
});
/* DELETE - horarios. */
router.delete('/horarios/:id', function(req, res){
   horarios.findByIdAndRemove(req.params.id, function(err){
     if(err){res.send(err)}
     res.json({message: 'horarios delete successful!'});
     meanCaseBase.auditSave(req,'Delete Register','horarios','Id: '+req.params.id);
   })
});
module.exports = router;