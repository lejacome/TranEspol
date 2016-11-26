var mongoose = require('mongoose');
var rutasSchema = new mongoose.Schema({
   nombre: String,
   tipo: String
});
mongoose.model('rutas', rutasSchema);