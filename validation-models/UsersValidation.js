var validationTRANS = require('../config/helpers/validationTRANS.js');
var data = {username:'not.empty|string|url',password:'decimal|integer',rol:'space',url:'email'}
var UsersValidation = new validationTRANS(data);
module.exports =  UsersValidation;
