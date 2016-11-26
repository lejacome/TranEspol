var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var passport = require('passport');
var ModelGeneralConfig = mongoose.model('ModelGeneralConfig');
var UsersValidation = require('../validation-models/UsersValidation.js');
var meanCaseBase = require('../config/helpers/meanCaseBase.js');

router.get('/users/testFuctions', function (req, res) {
	var prueba = true;
	var n1 = 10 , n2 = 11;
	res.json(meanCaseBase.powerFunctions.unless(""+n1+" equal "+n2+"",'hola '+ n2));
})

router.get('/users/testValidations', function (req, res) {
  var data = {username:'yaho.com.ec',password:12,rol:' ',url:'wwww@yahoo.com'}
  if(UsersValidation.pass(data).valid)
    res.json('Exito al guardar!');
  else
     res.json(UsersValidation.pass(data));

	//res.json(UsersValidation.pass(data));
})
/*  LOGIN   */

router.post('/register', function (req, res) {
	Users.register(new Users({
		username: req.body.username,
		rol: req.body.rol
	}), req.body.password, function (err, account) {
		if (err) {
			return res.status(500).json({
				err: err
			});
		}
		passport.authenticate('local')(req, res, function () {
			meanCaseBase.auditSave(req,"Insert Register","Users","User insert : "+req.body.username+" Rol insert: "+req.body.rol);
			return res.status(200).json({
				status: 'Registration successful!'
			});
		});
	});
});

router.put('/register', function (req, res) {
	
	Users.findByUsername(req.body.username).then(function(sanitizedUser){
    if (sanitizedUser){
    	sanitizedUser.username = req.body.newUsername;
    	sanitizedUser.rol = req.body.rol;
        sanitizedUser.setPassword(req.body.password, function(){
            sanitizedUser.save();
            meanCaseBase.auditSave(req,"Update Register","Users","User insert : "+req.body.username+" Rol insert: "+req.body.rol);
            return res.status(200).json({msg: 'password reset successful'});
        });
    } else {
        res.status(200).json({status: 0, msg: 'This user does not exist'});
    }
},function(err){
    console.log(err)
})
});


// Bulk Insert Test

router.get('/test', function (req, res) {
	var x;
	for (x = 1; x <= 100; x++) {
		Users.register(new Users({
			username: "test" + x,
			rol: x
		}), "test", function (err, account) {
			if (err) {
				return res.status(500).json({
					err: err
				});
			}
			passport.authenticate('local')(req, res, function () {
				return res.status(200).json({
					status: 'Registration successful!'
				});
			});
		});
	}

});

//Bulk Insert Test

router.post('/login', function (req, res, next) {
	req.session.us = false;
	passport.authenticate('local', function (err, user, info) {
		if (err) { 
			req.session.us = false;
			return res.status(500).json({
				err: err
			});
		}
		if (!user) {
			req.session.us = false;
			return res.status(401).json({
				err: info
			});
		}
		req.logIn(user, function (err) {
			if (err) {
				req.session.us = false;
				return res.status(500).json({
					err: 'Could not log in user'
				});
			}
			if (req.body.check) {
				var hour = 3600000;
				req.session.cookie.expires = new Date(Date.now() + hour);
				req.session.cookie.maxAge = hour;
				req.session.cookie.maxAge;
				req.session.check = req.body.check;
			} else {
				var time = 60000 * 15; //15 minets in session
				req.session.cookie.expires = new Date(Date.now() + time);
				req.session.cookie.maxAge = time;
				req.session.cookie.maxAge;
				req.session.check = req.body.check;
			}
			
			req.session.us = true;
			req.session.name = user.username;
			req.session.idd = user._id;
			req.session.rol = user.rol;
			res.status(200).json({
				status: 'Login successful!'
			});
			meanCaseBase.auditSave(req,"Login","Users","Id: "+user._id+" Username: "+user.username);
			
		});
	})(req, res, next);
});

router.get('/logout', function (req, res) {
	meanCaseBase.auditSave(req,"Logout","Users","Logout");
	req.logout();
	req.session.us = false;
	res.status(200).json({
		status: 'Bye!'
	});
	req.session.destroy();
});



/*  END LOGIN   */

/* GET users listing. */
router.get('/users', function (req, res, next) {
	Users.find(function (err, models) {
		if (err) {
			return next(err)
		}
		res.json(models);
		meanCaseBase.auditSave(req,'Query all Registers','Users','Query all Registers');
	})
});


//POST - Add users
router.post('/users', function (req, res, next) {
	var user = new Users(req.body);
	//user.password = passwordHash.generate(req.body.password); 
	user.save(function (err, user) {
		if (err) {
			return next(err)
		}
		res.json(user);
	})
})


//PUT - Update users
router.put('/users/:id', function (req, res) {
	Users.findById(req.params.id, function (err, user) {
		user.username = req.body.username;
		user.rol = req.body.rol;
		user.rol = req.body.rol;
		user.save(function (err) {
			if (err) {
				res.send(err)
			}

			res.json(user);
		})
	})
})

//get - Find By Id User
router.get('/users/:id', function (req, res) {
	Users.findById(req.params.id, function (err, user) {
		res.json(user);
	})
})

//DELETE - Delete users
router.delete('/users/:id', function (req, res) {
	Users.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			res.send(err)
		}
		res.json({
			message: 'Record deleted successfully'
		});
		meanCaseBase.auditSave(req,'Delete Register','Users','Id: '+req.params.id);
	})
})


module.exports = router;
