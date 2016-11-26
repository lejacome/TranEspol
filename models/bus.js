var mongoose = require('mongoose');
var busSchema = new mongoose.Schema({
   ndisco: String,
   marca: String,
   placa: String,
   modelo: String,
   csentados: Number,
   cparados: String
});
mongoose.model('bus', busSchema);