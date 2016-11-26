var gulp = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    concatCss = require('gulp-concat-css'),
    concatJs = require('gulp-concat'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    nodemon = require('gulp-nodemon'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    run = require('gulp-run'),
    historyApiFallback = require('connect-history-api-fallback');
 
var fs = require('fs-extra');
var fss = require('fs');
var replace = require("replace");
var mongoose = require('mongoose');
var shell = require('shelljs');
var tmpModels = require('./config/tmpModels.js');

/* ---------------------------------------------------
    Examples use command Run
gulp.task('start', function () {
  run('npm restart').exec() 
  .pipe(notify("Node Server Inicio!")); 
});

gulp.task('stop', function () {
  run('taskkill /IM node.exe -F').exec() 
  .pipe(notify("Se detuvo node server!")); 
});
------------------------------------------------------*/

gulp.task('exportProject', function () {
    var concatModels = '', concatRoutes='', concatApi='',menusString = '';
    var models      = tmpModels.models;
    var projectName = tmpModels.projectName;
    var authorName  = tmpModels.authorName;
    var email       = tmpModels.email;
    var license     = tmpModels.license;
    var mask        = tmpModels.mask;
    
    models = models.split(',');
    for (var i = 0; i < models.length; i++) {
      concatModels += "\nvar model_"+models[i]+" = require('./models/"+models[i]+"');";
      concatRoutes += "\nvar route_"+models[i]+" = require('./routes/"+models[i]+"');";
      concatApi    += "\napp.use('/api',route_"+models[i]+");";
      menusString  += '"'+models[i]+'",';
    }
    menusString = menusString.slice(0,-1);
    fs.copySync('config/backup/meanCase.js','project/'+projectName+'/config/helpers/meanCase.js' );
    fs.copySync('config/helpers/filters.js','project/'+projectName+'/config/helpers/filters.js' );
    fs.copySync('.bowerrc','project/'+projectName+'/.bowerrc' );
    fs.copySync('config/setup/models/modelGeneralConfig.js', 'project/'+projectName+'/config/setup/models/modelGeneralConfig.js');
    fs.copySync('config/setup/models/modelMenu.js', 'project/'+projectName+'/config/setup/models/modelMenu.js');
    fs.copySync('config/setup/routes/generalConfig.js', 'project/'+projectName+'/config/setup/routes/generalConfig.js');
    fs.copySync('config/setup/routes/menu.js', 'project/'+projectName+'/config/setup/routes/menu.js');
    var wsInitConfig = fs.createOutputStream('project/'+projectName+'/config/initConfig.js');
    wsInitConfig.write('(function(initConfig){\n  initConfig.config = function(){\n    var configurations = {\n      meanCase   : "meancase",\n      projectName : "'+projectName+'",\n      authorName   : "'+authorName+'",\n      email    : "'+email+'",\n      template  : "'+mask+'",\n      menus    : ['+menusString+']\n    };\n    return configurations;\n  }\n})(typeof exports === "undefined" ? initConfig = {} : exports);');
    var wsBower = fs.createOutputStream('project/'+projectName+'/bower.json');
    wsBower.write('{\n  "name": "'+projectName+'",\n  "version": "0.0.1",\n  "homepage": "https://github.com/afvs1989/MeanCaseSuperHeroic",\n  "authors": [\n    "'+authorName+' <'+email+'>"\n  ],\n  "description": "'+projectName+'",\n  "main": "views/index.ejs",\n  "moduleType": [],\n  "license": "'+license+'",\n  "private": true,\n  "ignore": [\n    "**/.*",\n    "node_modules",\n    "public/bower_components",\n    "test",\n    "tests"\n  ],\n  "dependencies": {\n    "angular": "~1.4.7",\n    "angular-route": "~1.4.7",\n    "bootstrap": "~3.3.5",\n    "angular-bootstrap": "~0.14.2",\n    "angular-sanitize": "~1.4.7",\n    "ui-select": "angular-ui-select#~0.13.2",\n    "fullpage.js": "~2.7.4",\n    "ngBootbox": "~0.1.2",\n    "bootbox.js": "bootbox#~4.4.0",\n    "angular-socket-io": "~0.7.0"\n  }\n}');
    var wsModels = fs.createOutputStream('project/'+projectName+'/app.js');
    wsModels.write("var express = require('express');\nvar path = require('path');\nvar favicon = require('serve-favicon');\nvar logger = require('morgan');\nvar cookieParser = require('cookie-parser');\nvar bodyParser = require('body-parser');\nvar mongoose = require('mongoose');\nvar passport = require('passport');\nvar localStrategy = require('passport-local' ).Strategy;\nvar expressSession = require('express-session');\nvar multipart = require('connect-multiparty');\nmongoose.connect('mongodb://localhost/"+projectName+"');\nvar model_Audit = require('./models/Audit.js');\nvar User = require('./models/Users.js');\nvar ModelMenu = require('./config/setup/models/modelMenu.js');\nvar ModelGeneralConfig = require('./config/setup/models/ModelGeneralConfig.js');"+concatModels+"\nvar route_Audit = require('./routes/Audit');\nvar routes = require('./routes/index');\nvar users = require('./routes/users');\nvar menu = require('./config/setup/routes/menu');\nvar generalConfig = require('./config/setup/routes/generalConfig');"+concatRoutes+"\nvar meanCaseBase = require('./config/helpers/meanCaseBase.js');\nvar app = express();\napp.set('views', path.join(__dirname, '/'));\napp.set('view engine', 'ejs');\napp.use(multipart());\napp.use(logger('dev'));\napp.use(bodyParser.json());\napp.use(bodyParser.urlencoded({ extended: false }));\napp.use(cookieParser());\napp.use(express.static(path.join(__dirname, 'public')));\napp.use(express.static(path.join(__dirname, 'views')));\napp.use(express.static(path.join(__dirname, 'config')));\napp.use(require('express-session')({\n  secret: 'keyboard cat',\n  resave: false,\n  saveUninitialized: false\n}));\napp.use(function (req, res, next) {\n  meanCaseBase.filter.isLogin(req,function(valid,warningMessage){\n    if(!valid){return next(res.json({warningMessage:warningMessage}));}\n    next();\n  });\n});\napp.get('/cookie', function(req, res) {\n  ModelGeneralConfig.findOne({meanCase:'meancase'}, function (err, data) {\n    req.session.projectName = data.projectName;\n    res.json({comp:req.session.us,check:req.session.check,user:{id:req.session.idd,username: req.session.name,rol:req.session.rol},project:{name:req.session.projectName}});\n  });\n});\n\napp.use(passport.initialize());\napp.use(passport.session());\npassport.use(new localStrategy(User.authenticate()));\npassport.serializeUser(User.serializeUser());\npassport.deserializeUser(User.deserializeUser());\n\napp.use('/api',route_Audit);\napp.use('/', routes);\napp.use('/api', users);\napp.use('/api', menu);\napp.use('/api', generalConfig);"+concatApi+"\napp.use(function(req, res, next) {\n  var err = new Error('Not Found');\n  err.status = 404;\n  next(err);\n});\nif (app.get('env') === 'development') {\n  app.use(function(err, req, res, next) {\n    res.status(err.status || 500);\n    res.render('error', {\n      message: err.message,\n      error: err\n    });\n  });\n}\napp.use(function(err, req, res, next) {\n  res.status(err.status || 500);\n  res.render('error', {\n    message: err.message,\n    error: {}\n  });\n});\nmodule.exports = app;");
    fs.copy('bin/www', 'project/'+projectName+'/bin/www.txt', function (err) {
      if (err) return console.log(err);
      fs.copy('config/settings.js', 'project/'+projectName+'/config/settings.js', function (err) {
        if (err) return console.log(err);
        fs.remove('models/backup', function (err) {
          if (err) return console.log(err);
          fs.remove('routes/backup', function (err) {
            if (err) return console.log(err);
            fs.copy('models/', 'project/'+projectName+'/models/', function (err) {
              if (err) return console.log(err);
              fs.copy('routes/', 'project/'+projectName+'/routes/', function (err) {
                if (err) return console.log(err);
                var pack = fs.createOutputStream('project/'+projectName+'/package.json');
                pack.write('{\n  "name": "'+projectName+'",\n  "version": "0.0.1",\n  "description": "'+projectName+'",\n  "author": {\n    "name": "'+authorName+'",\n    "email": "'+email+'"\n  },\n  "license": "'+license+'",\n  "private": true,\n  "scripts": {\n    "start": "node ./bin/www"\n  },\n  "dependencies": {\n    "body-parser": "~1.13.2",\n    "connect-history-api-fallback": "^1.1.0",\n    "connect-multiparty": "^2.0.0",\n    "cookie-parser": "~1.3.5",\n    "debug": "~2.2.0",\n    "ejs": "~2.3.3",\n    "express": "~4.13.1",\n    "express-session": "^1.11.3",\n    "install": "^0.1.8",\n    "mongoose": "^4.1.10",\n    "morgan": "~1.6.1",\n    "npm": "^3.3.5",\n    "passport": "^0.3.0",\n    "passport-local": "^1.0.0",\n    "passport-local-mongoose": "^3.1.0",\n    "path": "^0.12.7",\n    "serve-favicon": "~2.3.0",\n    "socket.io": "^1.3.7"\n  }\n}');
                fs.copy('public/favicon.ico', 'project/'+projectName+'/public/favicon.ico', function (err) {
                  if (err) return console.log(err);
                  fs.copy('public/images/', 'project/'+projectName+'/public/images', function (err) {
                    if (err) return console.log(err);
                    fs.copy('public/template', 'project/'+projectName+'/public/template', function (err) {
                      if (err) return console.log(err);
                      fs.copy('public/includes/', 'project/'+projectName+'/public/includes', function (err) {
                        if (err) return console.log(err);
                        fs.copy('public/templates/', 'project/'+projectName+'/public/templates', function (err) {
                          if (err) return console.log(err);
                          fs.copy('public/stylesheets/', 'project/'+projectName+'/public/stylesheets', function (err) {
                              if (err) return console.log(err);
                              var deleteFolderRecursive = function(path) {
                                if( fss.existsSync(path) ) {
                                  fss.readdirSync(path).forEach(function(file,index){
                                    var curPath = path + "/" + file;
                                    if(fss.lstatSync(curPath).isDirectory()) { // recurse
                                      deleteFolderRecursive(curPath);
                                    } else { // delete file
                                      fss.unlinkSync(curPath);
                                    }
                                  });
                                }
                              };
                              fs.copy('config/backup/app.js', 'app.js', function (err) {
                                if (err) return console.error(err)
                                fss.writeFileSync('project/'+projectName+'/routes/index.js', fss.readFileSync('config/backup/index.js'));
                                fss.writeFileSync('public/includes/concat.js', fss.readFileSync('config/backup/concat.js'));
                                fs.copySync('views/'+mask,'project/'+projectName+'/views/'+mask );
                                for (var x = 0; x < models.length; x++) {
                                  fss.unlink('models/'+models[x]+'.js', function (err) {
                                    if (err) return console.log(err);
                                  });
                                  fss.unlink('routes/'+models[x]+'.js', function (err) {
                                    if (err) return console.log(err);
                                  });
                                  fss.unlink('public/javascripts/models/'+models[x]+'Model.js', function (err) {
                                    if (err) return console.log(err);
                                  });
                                  deleteFolderRecursive('public/javascripts/controllers/'+models[x]);
                                  deleteFolderRecursive('public/templates/'+models[x]); 
                                  
                                }

                                //Part 2
                                shell.rm('-rf', 'public/javascripts/models/backup');
                                for (var i = 0; i < models.length; i++) {
                                  shell.rm('-rf', 'public/javascripts/controllers/'+models[i]);
                                  shell.rm('-rf', 'public/templates/'+models[i]);
                                }
                                fs.copySync('config/helpers/dataTypes.js', 'project/'+projectName+'/config/helpers/dataTypes.js');
                                fs.copySync('config/helpers/validationTRANS.js', 'project/'+projectName+'/config/helpers/validationTRANS.js');
                                fs.copySync('validation-models/', 'project/'+projectName+'/validation-models/');
                                fs.copySync('views/error.ejs', 'project/'+projectName+'/views/error.ejs');
                                fs.copySync('views/general-styles/chat.css', 'project/'+projectName+'/views/general-styles/chat.css');
                                fs.copySync('config/backup/README.md', 'project/'+projectName+'/README.md');
                                fss.rename('project/'+projectName+'/bin/www.txt', 'project/'+projectName+'/bin/www', function (err) {
                                  if (err) return console.log(err);
                                  shell.rm('-rf', 'validation-models/');
                                  fs.copySync('config/backup/UsersValidation.js', 'validation-models/UsersValidation.js');
                                  fs.copySync('config/helpers/powerFunctions.js', 'project/'+projectName+'/config/helpers/powerFunctions.js');
                                  fs.copySync('config/helpers/meanCaseBase.js', 'project/'+projectName+'/config/helpers/meanCaseBase.js');
                                  fs.copy('helpers/', 'project/'+projectName+'/helpers/', function (err) {
                                    if (err) return console.log(err);
                                    shell.rm('-rf', 'helpers/');
                                    fs.copySync('config/backup/loginAccessRoutes.js', 'helpers/loginAccessRoutes.js');
                                  });
                                  return console.log('Success!');
                                });

                                
                                
                              });     
                          })
                        })
                      })
                    })
                  })
                })
              })      
            })
          })
        })
      })
    })

})

gulp.task('server', function () {
  nodemon({ script: 'bin/www'
          , ext: 'js' })
    .on('restart', function () {
      console.log('restarted!')
    })
})



gulp.task('css', function () 
{
  gulp.src('public/stylesheets/*.css')
    .pipe(concatCss("todo.css"))
    .pipe(minifyCSS({keepBreaks:false}))
    .pipe(gulp.dest('public/stylesheets'))
    .pipe(notify("Ha finalizado la task css!"));
});
 

gulp.task('js', function() 
{
  gulp.src('public/javascripts/**/*.js')
    .pipe(concatJs('concat.js'))
    .pipe(gulp.dest('public/includes'))
    .pipe(notify("Su Front ha Sido actualizado!"));
});


gulp.task('watchFront', function() {
  watch('public/javascripts/**/*.js', function() {
    gulp.run(['js']);
  });
});





