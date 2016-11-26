var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var conductors = mongoose.model('conductors');
router.get('/conductors/:id', function (req, res) {
  conductors.findById(req.params.id, function (err, data) {
    res.json(data);
  })
})
/* GET conductors listing. */
router.get('/conductors', function(req, res, next) {
   conductors.find(function(err, models){
     if(err){return next(err)}
     res.json(models)
     meanCaseBase.auditSave(req,'Query all Registers','conductors','Query all Registers');
   })
});
/* POST - Add conductors. */
router.post('/conductors', function(req, res, next){
   var model = new conductors(req.body);
   model.save(function(err, data){
     if(err){return next(err)}
     res.json(data);
     meanCaseBase.auditSave(req,'Insert Register','conductors',data);
   })
});
/* PUT - Update conductors. */
router.put('/conductors/:id', function(req, res){
   conductors.findById(req.params.id, function(err, data){
     if(typeof req.body.nombre  != "undefined"){data.nombre = req.body.nombre;}
     if(typeof req.body.cedula  != "undefined"){data.cedula = req.body.cedula;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','conductors',data);
     })
   })
});
/* DELETE - conductors. */
router.delete('/conductors/:id', function(req, res){
   conductors.findByIdAndRemove(req.params.id, function(err){
     if(err){res.send(err)}
     res.json({message: 'conductors delete successful!'});
     meanCaseBase.auditSave(req,'Delete Register','conductors','Id: '+req.params.id);
   })
});
module.exports = router;