var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var comentarios = mongoose.model('comentarios');
router.get('/comentarios/:id', function (req, res) {
  comentarios.findById(req.params.id, function (err, data) {
    res.json(data);
  })
})
/* GET comentarios listing. */
router.get('/comentarios', function(req, res, next) {
   comentarios.find(function(err, models){
     if(err){return next(err)}
     res.json(models)
     meanCaseBase.auditSave(req,'Query all Registers','comentarios','Query all Registers');
   })
});
/* POST - Add comentarios. */
router.post('/comentarios', function(req, res, next){
   var model = new comentarios(req.body);
   model.save(function(err, data){
     if(err){return next(err)}
     res.json(data);
     meanCaseBase.auditSave(req,'Insert Register','comentarios',data);
   })
});
/* PUT - Update comentarios. */
router.put('/comentarios/:id', function(req, res){
   comentarios.findById(req.params.id, function(err, data){
     if(typeof req.body.nombre  != "undefined"){data.nombre = req.body.nombre;}
     if(typeof req.body.descripcion  != "undefined"){data.descripcion = req.body.descripcion;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','comentarios',data);
     })
   })
});
/* DELETE - comentarios. */
router.delete('/comentarios/:id', function(req, res){
   comentarios.findByIdAndRemove(req.params.id, function(err){
     if(err){res.send(err)}
     res.json({message: 'comentarios delete successful!'});
     meanCaseBase.auditSave(req,'Delete Register','comentarios','Id: '+req.params.id);
   })
});
module.exports = router;