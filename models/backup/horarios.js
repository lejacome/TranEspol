var mongoose = require('mongoose');
var horariosSchema = new mongoose.Schema({
   idruta: String,
   idbus: String,
   idconductor: String,
   fecha: Date,
   hora: String
});
mongoose.model('horarios', horariosSchema);