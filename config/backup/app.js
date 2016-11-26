var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var passport = require('passport');
var localStrategy = require('passport-local' ).Strategy;
var expressSession = require('express-session');
var multipart = require('connect-multiparty');
var settings = require('./config/settings.js');
mongoose.connect(settings.db);
//MODELS CRUD
var model_Audit = require('./models/Audit.js');
var User = require('./models/Users.js');
var ModelCrudConfiguration = require('./config/setup/models/modelCrudConfiguration.js');
var ModelSetup = require('./config/setup/models/modelSetup.js');
var ModelMenu = require('./config/setup/models/modelMenu.js');
var ModelRelationship = require('./config/setup/models/modelRelationship.js');
var ModelSchema = require('./config/setup/models/modelSchema.js');
var ModelGeneralConfig = require('./config/setup/models/ModelGeneralConfig.js');
//ROUTES CRUD 
var exportProject =  require('./config/setup/routes/exportProject');
var route_Audit = require('./routes/Audit');
var routes = require('./routes/index');
var users = require('./routes/users');
var config = require('./config/config');
var crudConfiguration = require('./config/setup/routes/crudConfiguration');
var setup = require('./config/setup/routes/setup');
var menu = require('./config/setup/routes/menu');
var relationship = require('./config/setup/routes/relationship');
var schema = require('./config/setup/routes/schema');
var generalConfig = require('./config/setup/routes/generalConfig');
var meanCaseBase = require('./config/helpers/meanCaseBase.js');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(multipart());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'config')));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
//Middlewares meanCase
    app.use(function (req, res, next) {
      meanCaseBase.filter.isLogin(req,function(valid,warningMessage){
            if(!valid){return next(res.json({warningMessage:warningMessage}));}
            next();
      });
    });
//Middlewares meanCase

//Call cookie

app.get('/cookie', function(req, res) {
    ModelGeneralConfig.findOne({meanCase:"meancase"}, function (err, data) {
        ModelSchema.find(function(err, r){
                var schemas = '';
                r.forEach(function(item){
                    if(item.name != 'Users')
                        schemas += item.name + ',';
                });
                schemas = schemas.slice(0,-1);
                req.session.projectName = data.projectName;
                req.session.template    = data.template;
                req.session.authorName  = data.authorName;
                req.session.projectType = data.projectType;
                req.session.email       = data.email;
                res.json({comp:req.session.us,check:req.session.check,user:{id:req.session.idd,username: req.session.name,rol:req.session.rol},project:{name:req.session.projectName,template:req.session.template,authorName:req.session.authorName,projectType:req.session.projectType,email:req.session.email,schemas:schemas}});
        });
    });
});

//Call cookie end

//Init passport
app.use(passport.initialize());
app.use(passport.session());
//configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//API ROUTES CRUD BY SCAFFOLDMEANHEROIC
app.use('/exportProject',exportProject);
app.use('/api',route_Audit);
app.use('/', routes);
app.use('/api', users);
app.use('/config', config);
app.use('/crudConfiguration', crudConfiguration);
app.use('/setup', setup);
app.use('/api', menu);
app.use('/api', relationship);
app.use('/api', schema);
app.use('/api', generalConfig);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('views/error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
