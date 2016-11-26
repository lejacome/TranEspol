var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ModelMenu = new Schema({
    name: String
});

module.exports = mongoose.model('ModelMenu', ModelMenu);