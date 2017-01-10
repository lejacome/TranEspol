var mongoose = require('mongoose');
var marcasSchema = new mongoose.Schema({
   marca: String,
   modelo: String
});
mongoose.model('marcas', marcasSchema);