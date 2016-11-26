var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bus = mongoose.model('bus');
router.get('/bus/:id', function (req, res) {
  bus.findById(req.params.id, function (err, data) {
    res.json(data);
  })
})
/* GET bus listing. */
router.get('/bus', function(req, res, next) {
   bus.find(function(err, models){
     if(err){return next(err)}
     res.json(models)
     meanCaseBase.auditSave(req,'Query all Registers','bus','Query all Registers');
   })
});
/* POST - Add bus. */
router.post('/bus', function(req, res, next){
   var model = new bus(req.body);
   model.save(function(err, data){
     if(err){return next(err)}
     res.json(data);
     meanCaseBase.auditSave(req,'Insert Register','bus',data);
   })
});
/* PUT - Update bus. */
router.put('/bus/:id', function(req, res){
   bus.findById(req.params.id, function(err, data){
     if(typeof req.body.ndisco  != "undefined"){data.ndisco = req.body.ndisco;}
     if(typeof req.body.marca  != "undefined"){data.marca = req.body.marca;}
     if(typeof req.body.placa  != "undefined"){data.placa = req.body.placa;}
     if(typeof req.body.modelo  != "undefined"){data.modelo = req.body.modelo;}
     if(typeof req.body.csentados  != "undefined"){data.csentados = req.body.csentados;}
     if(typeof req.body.cparados  != "undefined"){data.cparados = req.body.cparados;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','bus',data);
     })
   })
});
/* DELETE - bus. */
router.delete('/bus/:id', function(req, res){
   bus.findByIdAndRemove(req.params.id, function(err){
     if(err){res.send(err)}
     res.json({message: 'bus delete successful!'});
     meanCaseBase.auditSave(req,'Delete Register','bus','Id: '+req.params.id);
   })
});
module.exports = router;