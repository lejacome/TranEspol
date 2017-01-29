var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bus = mongoose.model('bus');
var marcas = mongoose.model("marcas");
router.get('/bus/:id-:schema', function (req, res) {
  var objTmp = {};
  objTmp[req.params.schema] = req.params.id;
  bus.find(objTmp, function (err, data) {
    res.json(data);
  })
})

router.get('/bus/:id', function (req, res) {
  bus.findById(req.params.id, function (err, data) {
    res.json(data);
  })
})
/* GET bus listing. */
router.get('/bus', function(req, res, next) {
   bus.find()
   .populate("marcas")
   .exec(function (err, results) {
     res.status(200).send(results);
     meanCaseBase.auditSave(req,'Query all Registers','bus','Query all Registers');
   });
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
     if(typeof req.body.marcas  != "undefined"){data.marcas = req.body.marcas;}
          if(typeof req.body.disco  != "undefined"){data.disco = req.body.disco;}
     if(typeof req.body.placa  != "undefined"){data.placa = req.body.placa;}
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