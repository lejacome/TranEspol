var mongoose = require('mongoose');
var rutasSchema = new mongoose.Schema({
   nombre: String,
   tipo: String,
   ruta: String
});
mongoose.model('rutas', rutasSchema);
