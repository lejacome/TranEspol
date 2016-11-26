var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ModelSetup = mongoose.model('ModelSetup');
var ModelGeneralConfig = mongoose.model('ModelGeneralConfig');
var settings = require('../../../config/settings.js');
var Users = mongoose.model('Users');
var passport = require('passport');
var ModelSchema = mongoose.model('ModelSchema');

router.get('/home', function (req, res, next) {
    ModelSetup.find(function (err, models) {
        if (err) {
            return next(err)
        }
        if(models == ""){
             var nameTemplete,labelTemplate;
             var templates = ['Admin Lte','Admin Sb','Admin Sb2','Bs Binary Admin','Dashgum Free','Karmanta Lite','Nice Admin','Simple','Simple Slidebar'];
             var labelTemplates = ['admin-lte','admin-sb','admin-sb2','bs-binary-admin','dashgum-free','karmanta-lite','nice-admin','simple','simple-slidebar'];
             for (var i = 0; i < templates.length; i++) {
                 nameTemplete = templates[i];
                 labelTemplate = labelTemplates[i];
                 var layout = new ModelSetup({
                    name: nameTemplete,
                    label: labelTemplate
                 });
                 layout.save();
                 
             };  
             res.render('config/setup/public/index', { title: 'Express' });
        }else{
            ModelGeneralConfig.find(function (err, models) {
                if(models == ""){
                    res.render('config/setup/public/index', { title: 'Express' });
                }else{
                    ModelGeneralConfig.findOne({meanCase:"meancase"}, function (err, data) {
                        res.redirect(settings.url);
                    })  
                }
                
            })
            
        }
    })

});

router.get('/layouts', function (req, res, next) {
    ModelSetup.find(function (err, models) {
        if (err) {
            return next(err)
        }
        res.json(models)
    })
});

router.post('/layouts', function (req, res, next) {
    var layout = new ModelSetup({
        name: req.body.name,
        label:((req.body.name).toLowerCase()).replace(/ /g,"-")
    });
    layout.save(function (err, layout) {
        if (err) {
            return next(err)
        } else {
            res.json(layout);
        }
    });
});


router.post('/setValues', function (req, res, next) {
    var confiGeneral = new ModelGeneralConfig(req.body);
    confiGeneral.meanCase = 'meancase';
    confiGeneral.save(function (err, confiGeneral) {
        if (err) {
            res.send(false);
        }
        Users.register(new Users({
        username: req.body.username,
        rol: 5
        }), req.body.password, function (err, account) {
            passport.authenticate('local');
           
        });
        res.send(true);
    })
    var schema = new ModelSchema();
    schema.name = "Users";
    schema.save();

});

module.exports = router;