var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ModelCrudConfiguration = new Schema({
    model: String,
    iRol: String,
    typeAcess: String,
    inputsType: String,
    inputsHtmlTypes: String,
    inputs: String,
    stringShowOnView: String,
    stringRequiered: String,
    stringHeaders: String

});

module.exports = mongoose.model('ModelCrudConfiguration', ModelCrudConfiguration);