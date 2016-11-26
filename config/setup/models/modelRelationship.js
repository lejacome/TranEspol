var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ModelRelationship = new Schema({
    modelA: String,
    cardinalitie: String,
    modelB: String,
    createFields: String,
    indexFields: String
});

module.exports = mongoose.model('ModelRelationship', ModelRelationship);