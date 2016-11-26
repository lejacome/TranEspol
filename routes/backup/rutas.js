var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var rutas = mongoose.model('rutas');
router.get('/rutas/:id', function (req, res) {
  rutas.findById(req.params.id, function (err, data) {
    res.json(data);
  })
})
/* GET rutas listing. */
router.get('/rutas', function(req, res, next) {
   rutas.find(function(err, models){
     if(err){return next(err)}
     res.json(models)
     meanCaseBase.auditSave(req,'Query all Registers','rutas','Query all Registers');
   })
});
/* POST - Add rutas. */
router.post('/rutas', function(req, res, next){
   var model = new rutas(req.body);
   model.save(function(err, data){
     if(err){return next(err)}
     res.json(data);
     meanCaseBase.auditSave(req,'Insert Register','rutas',data);
   })
});
/* PUT - Update rutas. */
router.put('/rutas/:id', function(req, res){
   rutas.findById(req.params.id, function(err, data){
     if(typeof req.body.nombre  != "undefined"){data.nombre = req.body.nombre;}
     if(typeof req.body.tipo  != "undefined"){data.tipo = req.body.tipo;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','rutas',data);
     })
   })
});
/* DELETE - rutas. */
router.delete('/rutas/:id', function(req, res){
   rutas.findByIdAndRemove(req.params.id, function(err){
     if(err){res.send(err)}
     res.json({message: 'rutas delete successful!'});
     meanCaseBase.auditSave(req,'Delete Register','rutas','Id: '+req.params.id);
   })
});
module.exports = router;