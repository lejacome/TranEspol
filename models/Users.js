// user model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
  username: String,
  password: String,
  rol:  	Number
});

User.setPassword = function (password, cb) {
    if (!password) {
        return cb(new BadRequestError(options.missingPasswordError));
    }

    var self = this;

    crypto.randomBytes(options.saltlen, function(err, buf) {
        if (err) {
            return cb(err);
        }

        var salt = buf.toString('hex');

        crypto.pbkdf2(password, salt, options.iterations, options.keylen, function(err, hashRaw) {
            if (err) {
                return cb(err);
            }

            self.set(options.hashField, new Buffer(hashRaw, 'binary').toString('hex'));
            self.set(options.saltField, salt);

            cb(null, self);
        });
    });
};
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('Users', User);