var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ModelGeneralConfig = mongoose.model('ModelGeneralConfig');
var initConfig = require('../config/initConfig.js');
var Users = mongoose.model('Users');
var ModelMenu = mongoose.model('ModelMenu');
var passport = require('passport');
var settings = require('../config/settings.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  ModelGeneralConfig.find(function (err, models) {
    if(models == ''){
      var c = initConfig.config();
      var confiGeneral = new ModelGeneralConfig();
      confiGeneral.meanCase = 'meancase';
      confiGeneral.projectName = c.projectName;
      confiGeneral.username = 'admin';
      confiGeneral.email = c.email;
      confiGeneral.template = c.template;
      confiGeneral.authorName = c.authorName;
      confiGeneral.save(function (err, confiGeneral) {
        if (err) throw err;
        var m = c.menus;
        for (var i = 0; i < m.length; i++) {
          var menu = new ModelMenu();
          menu.name = m[i];
          menu.save();
        }
        /*Register User ADMIN	*/
        Users.register(new Users({
          username: 'admin',
          rol: 4
        }), 'admin', function (err, account) {
          if (err) throw err;
          passport.authenticate('local');
          res.redirect(settings.url);
        });
        /*Register User ADMIN	*/
      })
    }else{
      ModelGeneralConfig.findOne({meanCase:'meancase'}, function (err, data) {
        res.render('views/'+data.template+'/index');
      })
    }
  })
});
module.exports = router;