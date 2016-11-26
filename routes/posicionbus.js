var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var posicionbus = mongoose.model('posicionbus');
router.get('/posicionbus/:id', function (req, res) {
  posicionbus.findById(req.params.id, function (err, data) {
    res.json(data);
  })
})
/* GET posicionbus listing. */
router.get('/posicionbus', function(req, res, next) {
   posicionbus.find(function(err, models){
     if(err){return next(err)}
     res.json(models)
     meanCaseBase.auditSave(req,'Query all Registers','posicionbus','Query all Registers');
   })
});
/* POST - Add posicionbus. */
router.post('/posicionbus', function(req, res, next){
   var model = new posicionbus(req.body);
   model.save(function(err, data){
     if(err){return next(err)}
     res.json(data);
     meanCaseBase.auditSave(req,'Insert Register','posicionbus',data);
   })
});
/* PUT - Update posicionbus. */
router.put('/posicionbus/:id', function(req, res){
   posicionbus.findById(req.params.id, function(err, data){
     if(typeof req.body.idbus  != "undefined"){data.idbus = req.body.idbus;}
     if(typeof req.body.fecha  != "undefined"){data.fecha = req.body.fecha;}
     if(typeof req.body.latitud  != "undefined"){data.latitud = req.body.latitud;}
     if(typeof req.body.longitud  != "undefined"){data.longitud = req.body.longitud;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','posicionbus',data);
     })
   })
});
/* DELETE - posicionbus. */
router.delete('/posicionbus/:id', function(req, res){
   posicionbus.findByIdAndRemove(req.params.id, function(err){
     if(err){res.send(err)}
     res.json({message: 'posicionbus delete successful!'});
     meanCaseBase.auditSave(req,'Delete Register','posicionbus','Id: '+req.params.id);
   })
});
module.exports = router;