var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ModelGeneralConfig = new Schema({
    template: String,
    login: String,
    projectName: String,
    username: String,
    email:String,
    meanCase:String,
    authorName:String,
    projectType:String
});

module.exports = mongoose.model('ModelGeneralConfig', ModelGeneralConfig);