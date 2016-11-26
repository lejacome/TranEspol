var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ModelSetup = new Schema({
    name: String,
    label: String
});

module.exports = mongoose.model('ModelSetup', ModelSetup);