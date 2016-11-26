var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ModelSchema = new Schema({
    name: String
});

module.exports = mongoose.model('ModelSchema', ModelSchema);