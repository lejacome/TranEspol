var mongoose = require('mongoose');
var AuditSchema = new mongoose.Schema({
   user: String,
   hostname: String,
   ip: String,
   action: String,
   scheme_affected: String,
   detail: String,
   date: Date,
   hour: String
});
mongoose.model('Audit', AuditSchema);