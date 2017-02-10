var mongoose = require('mongoose');
var comentariosSchema = new mongoose.Schema({
   nombre: String,
   descripcion: String
});
mongoose.model('comentarios', comentariosSchema);