var mongoose = require('mongoose');
var objetosSchema = new mongoose.Schema({
   nombre: String,
   descripcion: String,
   imagen: String
});
mongoose.model('objetos', objetosSchema);