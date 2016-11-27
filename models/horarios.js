var mongoose = require('mongoose');
var horariosSchema = new mongoose.Schema({
   fecha: Date,
   bus: { type: mongoose.Schema.ObjectId, ref: "bus" },
   conductors: { type: mongoose.Schema.ObjectId, ref: "conductors" },
   rutas: { type: mongoose.Schema.ObjectId, ref: "rutas" },
});
mongoose.model('horarios', horariosSchema);