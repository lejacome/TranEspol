var mongoose = require('mongoose');
var busSchema = new mongoose.Schema({
   disco: Number,
   placa: String,
   csentados: Number,
   cparados: Number,
   marcas: { type: mongoose.Schema.ObjectId, ref: "marcas" }
});
mongoose.model('bus', busSchema);