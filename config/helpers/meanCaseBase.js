
var powerFunctions = require('./powerFunctions.js');
var filter = require('./filters.js');
var meanCase = require('./meanCase.js');
var meanCaseBase = function(){
}

meanCaseBase.prototype.powerFunctions = powerFunctions;
meanCaseBase.prototype.filter = filter;
meanCaseBase.prototype.auditSave = meanCase.auditSave;
var meanCaseBase = new meanCaseBase;
module.exports = exports = meanCaseBase;
