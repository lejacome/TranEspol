var express = require('express');
var router = express.Router();
var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var connectionDb = require('../config/connectionDb.js');
var sequelize = connectionDb.sequelize;
var dataTypes = connectionDb.Sequelize;
var anuncios = require('../config/relationalModels/ANUNCIOS.js')(sequelize,dataTypes);
//var anuncio= anuncios(connectionDb);

/* GET conversorcabeceraisos listing. */
router.get('/exampleMssql', function(req, res, next) {
   anuncios.findAll().then(function(data) {
          res.json(data);
          meanCaseBase.auditSave(req,'Query all Registers','anuncios','Query all Registers');
   });
});




module.exports = router;