var mongoose = require('mongoose');
var horariosSchema = new mongoose.Schema({
   idruta: String,
   idbus: String,
   idconductor: String,
   fecha: Date,
   hora: String,
   bus: { type: mongoose.Schema.ObjectId, ref: "bus" },
   conductors: { type: mongoose.Schema.ObjectId, ref: "conductors" },
   rutas: { type: mongoose.Schema.ObjectId, ref: "rutas" },
   rutas: { type: mongoose.Schema.ObjectId, ref: "rutas" }
});
mongoose.model('horarios', horariosSchema);