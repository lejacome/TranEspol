var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fss = require('fs');
var fs = require('fs-extra');
var replace = require("replace");
var ModelMenu = mongoose.model('ModelMenu');
var unzip = require('unzip');
var ModelGeneralConfig = mongoose.model('ModelGeneralConfig');
var ModelSetup = mongoose.model('ModelSetup');
var ModelSchema = mongoose.model('ModelSchema');
var meanCase = require('../config/helpers/meanCase.js');
var ModelCrudConfiguration = mongoose.model('ModelCrudConfiguration');
var filter = require('../config/helpers/filters.js');
/* GET home page. */
router.get('/prueba', function(req, res, next) {
	filter.root(req.session.rol,function(valid,warningMessage){
		if(!valid){return next(res.json({warningMessage:warningMessage}));}
		res.send('Paso el filtro');
	});
});

/* General Cruds. */
router.post('/cruds', function(req, res, next) {
	var crud = req.body.schemeName,fields='',fieldSchema='';
	var iRol = req.body.rol;
	var inputs = req.body.fields;
	var array = inputs.split(',');
	var inputsType = req.body.dataTypes;
	var inputsHtmlTypes = req.body.inputsTypes;
	var arrayHtmlTypes = inputsHtmlTypes.split(',');
	var typeAcess =  req.body.typeAcess;
	var stringShowOnView = req.body.showOnView;
	var arrayShowOnView	 = stringShowOnView.split(',');
	var arrayTypes = inputsType.split(',');
	var stringRequiered = req.body.stringRequiered;
	var arrayRequiered = stringRequiered.split(',');
	var stringHeaders  = req.body.stringHeaders;
	var arrayHeaders   = stringHeaders.split(',');
	var dateFix = '',viewFixDate = '',controllerFixDate = '';
	/* SAVE CONFIGURATIONS FOR RELATIONSHIPS USE */
	var crudConfiguration = new ModelCrudConfiguration();
	crudConfiguration.model 			= crud;
    crudConfiguration.iRol 				= iRol;
    crudConfiguration.typeAcess			= typeAcess;
    crudConfiguration.inputsType   		= inputsType;
    crudConfiguration.inputsHtmlTypes   = inputsHtmlTypes;
    crudConfiguration.inputs 			= inputs;
    crudConfiguration.stringShowOnView  = stringShowOnView;
    crudConfiguration.stringRequiered   = stringRequiered;
    crudConfiguration.stringHeaders 	= stringHeaders;
	crudConfiguration.save();
	/* SAVE CONFIGURATIONS FOR RELATIONSHIPS USE */
	/*		Save Schema		*/
	var schema = new ModelSchema();
    schema.name = crud;
    schema.save();
    /*		Save Schema		*/
	/*		BACK END 		*/
	for (var i = 0; i < array.length; i++) {
		if(i < array.length){
			fields += '     if(typeof req.body.'+array[i]+'  != "undefined"){data.'+array[i]+' = '+'req.body.'+array[i]+';}\n';
		}else{
			fields += '     if(typeof req.body.'+array[i]+'  != "undefined"){data.'+array[i]+' = '+'req.body.'+array[i]+';}';
		}
	}
	var contFixDate = 0;
	for (var x = 0; x < array.length; x++) {
		if(x < (array.length-1)){
			fieldSchema += '   '+array[x]+': '+arrayTypes[x]+',\n';
		}else{
			fieldSchema += '   '+array[x]+': '+arrayTypes[x];
		}
		if(arrayTypes[x] == "Date"){
			contFixDate++;
			dateFix += '\n      item.dateAsString'+contFixDate+' = $filter("date")(item.'+array[x]+', "yyyy-MM-dd");';
			controllerFixDate += '\n        if($scope.item.'+array[x]+' === undefined){\n          $scope.item.'+array[x]+' = Date.parse(item.dateAsString'+contFixDate+');\n          $scope.item.'+array[x]+' = new Date($scope.item.'+array[x]+');\n          $scope.item.'+array[x]+' = $scope.item.'+array[x]+'.setDate($scope.item.'+array[x]+'.getDate() + 1);\n        }';
		}
		if(arrayHtmlTypes[x] == "time"){
			contFixDate++;
			dateFix += '\n      item.dateAsString'+contFixDate+' = $filter("date")(item.'+array[x]+', "HH:mm:ss");';
			controllerFixDate += '\n        if($scope.item.'+array[x]+' === undefined){\n          $scope.item.'+array[x]+' = item.dateAsString'+contFixDate+';\n        }';
		}
	};
	//Create routes/
	var vRoutes = "var meanCaseBase = require('../config/helpers/meanCaseBase.js');\nvar express = require('express');\nvar router = express.Router();\nvar mongoose = require('mongoose');\nvar "+crud+" = mongoose.model('"+crud+"');\nrouter.get('/"+crud+"/:id', function (req, res) {\n  "+crud+".findById(req.params.id, function (err, data) {\n    res.json(data);\n  })\n})\n/* GET "+crud+" listing. */\nrouter.get('/"+crud+"', function(req, res, next) {\n   "+crud+".find(function(err, models){\n     if(err){return next(err)}\n     res.json(models)\n     meanCaseBase.auditSave(req,'Query all Registers','"+crud+"','Query all Registers');\n   })\n});\n/* POST - Add "+crud+". */\nrouter.post('/"+crud+"', function(req, res, next){\n   var model = new "+crud+"(req.body);\n   model.save(function(err, data){\n     if(err){return next(err)}\n     res.json(data);\n     meanCaseBase.auditSave(req,'Insert Register','"+crud+"',data);\n   })\n});\n/* PUT - Update "+crud+". */\nrouter.put('/"+crud+"/:id', function(req, res){\n   "+crud+".findById(req.params.id, function(err, data){\n"+fields+"     data.save(function(err){\n       if(err){res.send(err)}\n       res.json(data);\n       meanCaseBase.auditSave(req,'Update Register','"+crud+"',data);\n     })\n   })\n});\n/* DELETE - "+crud+". */\nrouter.delete('/"+crud+"/:id', function(req, res){\n   "+crud+".findByIdAndRemove(req.params.id, function(err){\n     if(err){res.send(err)}\n     res.json({message: '"+crud+" delete successful!'});\n     meanCaseBase.auditSave(req,'Delete Register','"+crud+"','Id: '+req.params.id);\n   })\n});\nmodule.exports = router;";
	var wsRoutes = fs.createOutputStream('routes/'+crud+'.js');
	wsRoutes.write(vRoutes);
	var backupRoutes = fs.createOutputStream('routes/backup/'+crud+'.js');
	backupRoutes.write(vRoutes);
	//Create models/
	var vModels = "var mongoose = require('mongoose');\nvar "+crud+"Schema = new mongoose.Schema({\n"+fieldSchema+"\n});\nmongoose.model('"+crud+"', "+crud+"Schema);";
	var wsModels = fs.createOutputStream('models/'+crud+'.js');
	wsModels.write(vModels);
	var backupModels = fs.createOutputStream('models/backup/'+crud+'.js');
	backupModels.write(vModels);
  	//Add lines to app.js
  	replace({
	    regex: "//ROUTES CRUD BY SCAFFOLDMEANHEROIC",
	    replacement: "//ROUTES CRUD BY SCAFFOLDMEANHEROIC\nvar route_"+crud+" = require('./routes/"+crud+"');",
	    paths: ['app.js'],
	    recursive: true,
	    silent: true,
	});
	replace({
	    regex: "//MODELS CRUD BY SCAFFOLDMEANHEROIC",
	    replacement: "//MODELS CRUD BY SCAFFOLDMEANHEROIC\nvar model_"+crud+" = require('./models/"+crud+".js');",
	    paths: ['app.js'],
	    recursive: true,
	    silent: true,
	});
	replace({
	    regex: "//API ROUTES CRUD BY SCAFFOLDMEANHEROIC",
	    replacement: "//API ROUTES CRUD BY SCAFFOLDMEANHEROIC\napp.use('/api',route_"+crud+");",
	    paths: ['app.js'],
	    recursive: true,
	    silent: true,
	});

	/*		BACK END 		*/


	/*		FRONT END 		*/
	//Views Front
	var tdFields = '',divFields = '',createArguments = '',argService = '',argService2 = '',argService3 = '',fieldsModelDynamic = '';
	var contFixDate = 0;
	for (var z = 0; z < array.length; z++) {
		if(arrayShowOnView[z] != 'hidden' ){
			if(arrayTypes[z] == "Date" || arrayHtmlTypes[z] == 'time'){
				if(arrayTypes[z] == "Date"){
					tdFields += "<td at-sortable  at-title='"+arrayHeaders[z]+"' width='150' >{{item."+array[z]+" | date : 'MM-dd-yyyy'}}</td>\n           ";
				}else{
					tdFields += "<td  at-sortable  at-title='"+arrayHeaders[z]+"' width='150' >{{item."+array[z]+" | date : 'HH:mm:ss'}}</td>\n           ";
				}
				
			}else{
				tdFields += "<td  at-sortable  at-title='"+arrayHeaders[z]+"' width='150'>{{item."+array[z]+"}}</td>\n           ";
			}
			
	}	}
	for (var x = 0; x < array.length; x++) {
		if(arrayTypes[x] == "Date" || arrayHtmlTypes[x] == 'time'){
			contFixDate++;
			viewFixDate = 'value="{{ item.dateAsString'+contFixDate+' }}"';
		}else{
			viewFixDate = '';
		}
		divFields += '<div class="row" '+arrayShowOnView[x]+'><div class="form-group col-md-12"><label for="'+array[x]+'" class="bold">'+arrayHeaders[x]+'</label><input  autofocus '+arrayRequiered[x]+' name="'+array[x]+'" type="'+arrayHtmlTypes[x]+'" class="form-control"  ng-model="item.'+array[x]+'" '+viewFixDate+'></div></div>\n       ';
	}

	for (var xx = 0; xx < array.length; xx++) {
			createArguments += '\n        '+crud+'.'+array[xx]+' = $scope.item.'+array[xx]+';';
	};

	for (var oo = 0; oo < array.length; oo++) {
			fieldsModelDynamic += '\n        '+crud+'Model.'+array[oo]+' = $scope.item.'+array[oo]+';';
	};

	for (var yy = 0; yy < array.length; yy++) {
		if(yy < (array.length-1)){
			argService += array[yy]+',';
		}else{
			argService += array[yy];
		}
	};
	for (var zz = 0; zz < array.length; zz++) {
		if(zz < (array.length-1)){
			argService2 += '"'+array[zz]+'"'+ ',';
		}else{
			argService2 += '"'+array[zz]+'"';
		}
	};
	for (var uu = 0; uu < array.length; uu++) {
		if(uu < (array.length-1)){
			argService3 += array[uu]+': $scope.item.'+array[uu]+',';
		}else{
			argService3 += array[uu]+': $scope.item.'+array[uu];
		}
	};
	var vIndex = '<div class="container-fluid">\n   <div class="row div-padding">\n     <button ng-click="open()" class="btn btn-default "><i class="fa fa-plus"></i> Create New</button>\n     <div class="alert alert-{{alert}}" ng-show="msjAlert">{{message}}</div>\n   </div>\n   <div class="row">\n     <div class="input-group">\n       <span class="input-group-addon" id="basic-addon1"><i class="fa fa-search"></i></span>\n       <input ng-model="searchText" type="text" class="form-control" placeholder="Search" aria-describedby="basic-addon1">\n     </div>\n     <table ng-hide="preloader" class="table table-bordered table-hover table-striped" at-table at-paginated at-list="'+crud+'List | filter:searchText" at-config="configTable">\n       <thead></thead>\n       <tbody>\n         <tr>\n           '+tdFields+'\n           <td  at-title="Acción" width="250"><button type="button" class="btn btn-default" ng-click="open(item)"><i class="fa fa-pencil-square-o"></i></button><button type="button" class="btn btn-default" ng-click="openDelete(item)"><i class="fa fa-trash-o"></i></button></td>\n         </tr>\n       </tbody>\n     </table>\n     <div class="col-md-6 col-md-offset-3" ><at-pagination ng-hide="preloader" at-list="'+crud+'List" at-config="configTable"></at-pagination></div>\n     <div class="row col-lg-offset-6 col-md-offset-6 col-xs-offset-6" ng-hide="!preloader"><i class="fa fa-spinner fa-spin fa-5x position-spinner"></i></div>\n   </div>\n</div>';
	var wsIndex = fs.createOutputStream('public/templates/'+crud+'/index.html');
	wsIndex.write(vIndex);
	var backupIndex = fs.createOutputStream('public/templates/'+crud+'/backup/index.html');
	backupIndex.write(vIndex);

	var vDelete = '<div class="modal-header">\n   <h3 class="modal-title">¿Está seguro?</h3>\n</div>\n<div class="modal-body clearfix">\n   <i class="pull-left fa fa-trash-o fa-3x" />\n   <div class="pull-left">\n     ¿Está seguro que desea borrar el Registro?\n     <div>\n       <h4>{{item.'+array[0]+'}}</h4>\n     </div>\n   </div>\n</div>\n<div class="modal-footer">\n   <button ng-hide="deleting" class="btn btn-default" ng-click="$dismiss()">Cancelar</button>\n    <button autoselect class="btn btn-default" type="button" ng-click="ok()"><span ng-hide="deleting">Eliminar</span><i ng-show="deleting" class="fa fa-spinner fa-spin"></i></button>\n</div>';
	var wsDelete = fs.createOutputStream('public/templates/'+crud+'/modalDelete.html');
	wsDelete.write(vDelete);
	var backupDelete = fs.createOutputStream('public/templates/'+crud+'/backup/modalDelete.html');
	backupDelete.write(vDelete);

	var vCreate = '<div class="modal-header">\n   <div class="pull-right">\n     <button type="button" class="close pull-right" ng-click="$dismiss()">&times;</button>\n   </div>\n<div>\n   <h3 class="modal-title" ng-if="!item._id">Create</h3>\n   <h3 class="modal-title" ng-if="item._id">Edit</h3>\n</div>\n</div>\n<div>\n<form name="myForm" ng-submit="save()" method="POST">\n   <div class="modal-body">\n     <fieldset>\n       '+divFields+'\n     </fieldset>\n</div>\n<div class="modal-footer">\n   <button ng-disabled="myForm.$invalid || myForm.$pristine" class="btn btn-primary pull-right" type="submit" title="Save"><span ng-if="saving"><i class="fa fa-spinner fa fa-spin"></i>&nbsp;</span><span>Save</span></button>\n</div>\n</form>\n</div>';
	var wsCreate = fs.createOutputStream('public/templates/'+crud+'/modalCreate.html');
	wsCreate.write(vCreate);
	var backupCreate = fs.createOutputStream('public/templates/'+crud+'/backup/modalCreate.html');
	backupCreate.write(vCreate);
	//Controllers Front

	var vIndexController = ".controller('"+crud+"Controller',\n  ['$rootScope','$scope', '$location', '"+crud+"Model','$uibModal',\n  function ($rootScope,$scope, $location, "+crud+"Model,$uibModal) {\n    $scope.titleController = 'MEAN-CASE SUPER HEROIC';\n    $rootScope.titleWeb = '"+crud+"';\n    $scope.preloader = true;\n    $scope.msjAlert = false;\n    "+crud+"Model.getAll().then(function(data) {\n      $scope."+crud+"List = data;\n      $scope."+crud+"Temp = angular.copy($scope."+crud+"List);\n      $scope.preloader = false;\n    });\n    /*  Modal */\n     $scope.open = function (item) {\n       var modalInstance = $uibModal.open({\n        animation: true,\n        templateUrl: 'templates/"+crud+"/modalCreate.html',\n        controller: 'modal"+crud+"CreateController',\n        size: 'lg',\n        resolve: {\n         item: function () {\n          return item;\n         }\n        }\n      });\n      modalInstance.result.then(function(data) {\n        if(!item) {\n           $scope."+crud+"List.push(data);\n           $scope."+crud+"Temp = angular.copy($scope."+crud+"List);\n        }\n      },function(result){\n      $scope."+crud+"List = $scope."+crud+"Temp;\n      $scope."+crud+"Temp = angular.copy($scope."+crud+"List);\n    });\n  };\n  /*  Delete  */\n  $scope.openDelete = function (item) {\n    var modalInstance = $uibModal.open({\n      animation: true,\n      templateUrl: 'templates/"+crud+"/modalDelete.html',\n      controller: 'modal"+crud+"DeleteController',\n      size: 'lg',\n      resolve: {\n        item: function () {\n           return item;\n        }\n      }\n    });\n    modalInstance.result.then(function(data) {\n      var idx = $scope."+crud+"List.indexOf(data);\n      $scope."+crud+"List.splice(idx, 1);\n      "+crud+"Model\n        .destroy(data._id)\n        .then(function(result) {\n          $scope.msjAlert = true;\n          $scope.alert = 'success';\n          $scope.message = result.message;\n        })\n        .catch(function(err) {\n          $scope.msjAlert = true;\n          $scope.alert = 'danger';\n          $scope.message = 'Error '+err;\n        })\n      });\n    };\n}])";
	var wsIndexController = fs.createOutputStream('public/javascripts/controllers/'+crud+'/indexController.js');
	wsIndexController.write(vIndexController);
	var backupIndexController = fs.createOutputStream('public/javascripts/controllers/'+crud+'/backup/indexController.txt');
	backupIndexController.write(vIndexController);
	
	var vDeleteController  = ".controller('modal"+crud+"DeleteController',\n  ['$scope', '$uibModalInstance', 'item',\n  function ($scope, $uibModalInstance, item) {\n    $scope.item = item;\n    $scope.ok = function () {\n      $uibModalInstance.close($scope.item);\n    };\n    $scope.cancel = function () {\n       $uibModalInstance.dismiss('cancel');\n     };\n}])";
	var wsDeleteController = fs.createOutputStream('public/javascripts/controllers/'+crud+'/modal'+crud+'DeleteController.js');
	wsDeleteController.write(vDeleteController);
	var backupDeleteController = fs.createOutputStream('public/javascripts/controllers/'+crud+'/backup/modal'+crud+'DeleteController.txt');
	backupDeleteController.write(vDeleteController);
	
	var vCreateController  = ".controller('modal"+crud+"CreateController',\n  ['$scope', '$uibModalInstance', 'item','"+crud+"Model','$filter',\n  function ($scope, $uibModalInstance, item,"+crud+"Model,$filter) {\n    $scope.item = item;\n    $scope.saving = false;\n    if(item){"+dateFix+"\n       //add optional code\n    }\n    $scope.save = function () {\n      if(!item){\n        $scope.saving = true;\n        item = {"+argService3+"};\n        var "+crud+" = "+crud+"Model.create();"+createArguments+"\n        "+crud+".save().then(function(r){\n          $scope.saving = false;\n          $uibModalInstance.close(r);\n        });\n      }else{"+controllerFixDate+"\n        "+crud+"Model.findById($scope.item._id);"+fieldsModelDynamic+"\n        "+crud+"Model.save().then(function(r){\n          $scope.saving = false;\n          $uibModalInstance.close(r);\n        });\n      }\n    };\n}])";
	var wsCreateController = fs.createOutputStream('public/javascripts/controllers/'+crud+'/modal'+crud+'CreateController.js');
	wsCreateController.write(vCreateController);
	var backupCreateController = fs.createOutputStream('public/javascripts/controllers/'+crud+'/backup/modal'+crud+'CreateController.txt');
	backupCreateController.write(vCreateController);
	
	var vServise  = ".service('"+crud+"Model', function ($optimumModel) {\n  var model = new $optimumModel();\n  model.url = '/api/"+crud+"';\n  model.constructorModel = ["+argService2+"];\n  return model;\n})";
	var wsServise = fs.createOutputStream('public/javascripts/models/'+crud+'Model.js');
	wsServise.write(vServise);
	var backupServise = fs.createOutputStream('public/javascripts/models/backup/'+crud+'Model.txt');
	backupServise.write(vServise);
	
	var vConfig  = ".config(function ($routeProvider) {\n  $routeProvider\n    .when('/"+crud+"', {\n      templateUrl: '/templates/"+crud+"/index.html',\n      controller: '"+crud+"Controller',\n      access: {\n        restricted: "+typeAcess+",\n       rol: "+iRol+"\n      }\n    });\n })";
	var wsConfig = fs.createOutputStream('public/javascripts/controllers/'+crud+'/_config.js');
	wsConfig.write(vConfig);
	var backupConfig = fs.createOutputStream('public/javascripts/controllers/'+crud+'/backup/_config.txt');
	backupConfig.write(vConfig);
	
	/*		FRONT END 		*/
	/*		SAVE MENU       */
	var menu = new ModelMenu();
	menu.name = crud;
	menu.save();
	/*		SAVE MENU       */



   	res.json({status: 'Crud Successful! your route is: ',route:crud});

  	
});



router.post('/upload', function(req, res) {

   var path = req.files.file.path
   var newPath = 'tmp/'+req.body.name+'.zip'

   var is = fss.createReadStream(path)
   var os = fss.createWriteStream(newPath)

   is.pipe(os)

   is.on('end', function() {
      //eliminamos el archivo temporal
      fss.unlinkSync(path)
   })
   var layout = new ModelSetup({
        name: req.body.name,
        label:((req.body.name).toLowerCase()).replace(/ /g,"-")
    });
    layout.save();

    ModelGeneralConfig.findOne({meanCase:"meancase"}, function (err, data) {
		data.template = req.body.name;
		data.save();
	})

   setTimeout(function() {
   	fss.createReadStream(newPath).pipe(unzip.Extract({ path: 'views/' }));
    res.send('Upload file success!');
   }, 8000);
   
   
   
})

router.put('/updateTemplate', function (req, res) {
	ModelGeneralConfig.findOne({meanCase:"meancase"}, function (err, data) {
		data.template = req.body.template;
		data.save(function (err) {
			if (err) {
				res.send(err)
			}

			res.send(true);
		})
	})
})


router.post('/backupCrud', function (req, res) {
	var arg = req.body.arg,opt =req.body.arg2,manyModels = req.body.manyModels,manyIdRelationships = req.body.manyIdRelationships;
	if(opt == 1){
		var exc = meanCase.backup(arg);
		res.send(exc);
	}else{
		meanCase.relationship(manyModels,arg,manyIdRelationships);
		res.send(true);
	}
})

router.post('/generateRelationship', function (req, res) {
	var opt = req.body.opt ,models = req.body.models ,modelB = req.body.modelB,cardinalitie = req.body.cardinalitie,idRelationships = req.body.idRelationships;
	if(opt == 1){
		 meanCase.relationship(models,modelB,idRelationships,cardinalitie);
		 res.json({models: models,modelB : modelB ,idRelationships: idRelationships,cardinalitie:cardinalitie});

	}else{
		meanCase.relationship(models,modelB,idRelationships,cardinalitie);
		res.json({models: models,modelB : modelB ,idRelationships: idRelationships,cardinalitie:cardinalitie});
	}
})


module.exports = router;