var mongoose = require('mongoose');
var conductorsSchema = new mongoose.Schema({
   nombre: String,
   cedula: Number
});
mongoose.model('conductors', conductorsSchema);