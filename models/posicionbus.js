var mongoose = require('mongoose');
var posicionbusSchema = new mongoose.Schema({
   idbus: String,
   fecha: Date,
   latitud: String,
   longitud: String
});
mongoose.model('posicionbus', posicionbusSchema);