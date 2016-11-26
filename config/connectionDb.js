var Sequelize = require('sequelize');
var path      = require("path");
var env       =  "ambiente";
var config    = require(path.join(__dirname, '..', 'config/', 'config.json'))[env];
var sequelize = new Sequelize(config.database, config.username,config.password, {
  host: config.host,
  dialect: config.dialect,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});


module.exports = {sequelize,Sequelize};