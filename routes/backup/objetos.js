var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var objetos = mongoose.model('objetos');
router.get('/objetos/:id', function (req, res) {
  objetos.findById(req.params.id, function (err, data) {
    res.json(data);
  })
})
/* GET objetos listing. */
router.get('/objetos', function(req, res, next) {
   objetos.find(function(err, models){
     if(err){return next(err)}
     res.json(models)
     meanCaseBase.auditSave(req,'Query all Registers','objetos','Query all Registers');
   })
});
/* POST - Add objetos. */
router.post('/objetos', function(req, res, next){
   var model = new objetos(req.body);
   model.save(function(err, data){
     if(err){return next(err)}
     res.json(data);
     meanCaseBase.auditSave(req,'Insert Register','objetos',data);
   })
});
/* PUT - Update objetos. */
router.put('/objetos/:id', function(req, res){
   objetos.findById(req.params.id, function(err, data){
     if(typeof req.body.nombre  != "undefined"){data.nombre = req.body.nombre;}
     if(typeof req.body.descripcion  != "undefined"){data.descripcion = req.body.descripcion;}
     if(typeof req.body.imagen  != "undefined"){data.imagen = req.body.imagen;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','objetos',data);
     })
   })
});
/* DELETE - objetos. */
router.delete('/objetos/:id', function(req, res){
   objetos.findByIdAndRemove(req.params.id, function(err){
     if(err){res.send(err)}
     res.json({message: 'objetos delete successful!'});
     meanCaseBase.auditSave(req,'Delete Register','objetos','Id: '+req.params.id);
   })
});
module.exports = router;