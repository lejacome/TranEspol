(function(meanCase){
	  var mongoose = require('mongoose');
	  var Audit = mongoose.model('Audit');
	  var fs = require('fs-extra');
	  var express = require('express');
	  var router = express.Router();
	  var fss = require('fs');
	  var replace = require("replace");
	  var ModelMenu = mongoose.model('ModelMenu');
	  var unzip = require('unzip');
	  var ModelGeneralConfig = mongoose.model('ModelGeneralConfig');
	  var ModelSetup = mongoose.model('ModelSetup');
	  var ModelSchema = mongoose.model('ModelSchema');
	  var ModelCrudConfiguration = mongoose.model('ModelCrudConfiguration');
	  var ModelRelationship = mongoose.model('ModelRelationship');

	  meanCase.auditSave = function(req,action,scheme_affected,detail){
	  	var ip = req.headers['x-forwarded-for'] || 
	    req.connection.remoteAddress || 
	    req.socket.remoteAddress ||
	    req.connection.socket.remoteAddress; 
	  	var date = new Date();
		var current_hour = date.getHours();
		var user = "";
	    var model = new Audit();
	    if(req.session.name)
	    	user = req.session.name;
	    else
	    	user = "Register";
	    model.user = user;
	    model.hostname = req.headers.host;
	    model.ip = ip;
	    model.action = action;
	    model.scheme_affected = scheme_affected;
	    model.detail = detail;
	    model.date = date;
	    model.hour = current_hour + ':' + date.getMinutes();
	    model.save();
	  };
	  meanCase.backup = function(arg){
	  	var dev = true;
	  	fs.copy('models/backup/'+arg+'.js', 'models/'+arg+'.js', function (err) {
		  if (err) dev = false;
		  fs.copy('routes/backup/'+arg+'.js', 'routes/'+arg+'.js', function (err) {
			  if (err) dev = false;
			  fs.copy('public/templates/'+arg+'/backup/index.html', 'public/templates/'+arg+'/index.html', function (err) {
				  if (err) dev = false;
				  fs.copy('public/templates/'+arg+'/backup/modalCreate.html', 'public/templates/'+arg+'/modalCreate.html', function (err) {
					  if (err) dev = false;
					  fs.copy('public/templates/'+arg+'/backup/modalDelete.html', 'public/templates/'+arg+'/modalDelete.html', function (err) {
						  if (err) dev = false;
						  fs.copy('public/javascripts/models/backup/'+arg+'Model.txt', 'public/javascripts/models/'+arg+'Model.js', function (err) {
							  if (err) dev = false;
							  fs.copy('public/javascripts/controllers/'+arg+'/backup/indexController.txt', 'public/javascripts/controllers/'+arg+'/indexController.js', function (err) {
								  if (err) dev = false;
								  fs.copy('public/javascripts/controllers/'+arg+'/backup/modal'+arg+'CreateController.txt', 'public/javascripts/controllers/'+arg+'/modal'+arg+'CreateController.js', function (err) {
									  if (err) dev = false;
									  fs.copy('public/javascripts/controllers/'+arg+'/backup/modal'+arg+'DeleteController.txt', 'public/javascripts/controllers/'+arg+'/modal'+arg+'DeleteController.js', function (err) {
										  if (err) dev = false;
										  dev = true;
								  	  })
							  	  })
						  	  })
					  	  }) 
				  	  }) 
		  	  	  }) 
		  	  }) 
		  }) 
		}) 
		return dev;
	  };
	  meanCase.relationship = function(models,modelB,idRelationships,cardinalitie){
	  	cardinalitie = cardinalitie || '';
	  	//Model A or Models
	  	var models = models.split(","),idRelationships = idRelationships.split(","),sviewFields = '',sindexFields = '';
	  	for (var lll = 0; lll < idRelationships.length; lll++) {
			ModelRelationship.findOne({_id:idRelationships[lll]}, function (err, da) {
				sviewFields		+= da.createFields + '|';
				sindexFields	+= da.indexFields +  '|';
				cardinalitie	=  da.cardinalitie;	
				if(lll   >  (idRelationships.length-1)){
		  			sviewFields   = sviewFields.split("-");
		  			sindexFields  = sindexFields.split("-");
				}
	  			
			  	ModelCrudConfiguration.findOne({model:modelB}, function (err, data) {
				  	var crud = data.model,fields='',fieldSchema='';
					var iRol = data.iRol;
					var inputs = data.inputs;
					var array = inputs.split(',');
					var inputsType = data.inputsType;
					var inputsHtmlTypes = data.inputsHtmlTypes;
					var arrayHtmlTypes = inputsHtmlTypes.split(',');
					var typeAcess = data.typeAcess;
					var stringShowOnView = data.stringShowOnView;
					var arrayShowOnView	 = stringShowOnView.split(',');
					var arrayTypes = inputsType.split(',');
					var stringRequiered = data.stringRequiered;
					var arrayRequiered = stringRequiered.split(',');
					var stringHeaders  = data.stringHeaders;
					var arrayHeaders   = stringHeaders.split(',');
					var dateFix = '',viewFixDate = '',controllerFixDate = '';
					if(cardinalitie == 2){
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
								fieldSchema += '   '+array[x]+': '+arrayTypes[x]+',\n';
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

						/* Relationships */
						var indexViewsRelationships = '', argumentsRelationshipViews = '', relationshipUiSelect1 = '', relationshipUiSelect2 = '', relationshipUiSelect3 = '', relationshipViewCreate = '', relationshipCreateControllerCreate = '',relationshipCreateControllerEdit = '', relationshipCreateControllerAll = '',  relationshipCreateControllerArg1 = '', relationshipCreateControllerArg2 = '', modelConstructRelationship = '', modelBackEnd = '', routeBackendArg1 = '', routeBackendArg3 = '',routeBackendArg2 = '';
						var viewFields,allViewCreate = '',tviewFields,tindexFields,cadDependencies = '',injectModels = '';						
						relationshipUiSelect2 = relationshipUiSelect2.slice(0,-1);
						var indexFields,superArray = [],superArray2 = [],superArray3 = [],superArray4 = [];
						for (var afvs = 0; afvs < models.length; afvs++) {
							cadDependencies += models[afvs]+':'+models[afvs]+'Model.url,';
							injectModels    += models[afvs]+'Model,';
							if(lll   >  (idRelationships.length-1)){
								//for (var abfvs = 0; abfvs < sindexFields.length; abfvs++) {
									allViewCreate +=  '\n           <label for="'+models[afvs]+'" class="bold">'+models[afvs]+'</label>\n           \n           <ui-select required ng-model="item.'+models[afvs]+'" theme="bootstrap" ng-disabled="disabled" style="min-width: 300px;" title="Select a '+models[afvs]+'">\n             <ui-select-match placeholder="Select a '+models[afvs]+'">';
									viewFields = sviewFields[0].split("|");
									for (var bfvs = 0; bfvs < (viewFields.length - 1); bfvs++) {
										tviewFields = viewFields[bfvs].split(",");
										for (var yop = 0; yop < tviewFields.length; yop++) {
											relationshipUiSelect1 +=  '{{$select.selected.'+tviewFields[yop]+'}} ';
											relationshipUiSelect2 +=  ''+tviewFields[yop]+': $select.search,';
											relationshipUiSelect3 +=  '\n               '+'<div ng-bind-html="item.'+tviewFields[yop]+' | highlight: $select.search"></div>';
										}
										//relationshipUiSelect2 = relationshipUiSelect2.slice(0,-1);
										superArray.push(relationshipUiSelect1);
										superArray2.push(relationshipUiSelect2);
										superArray3.push(relationshipUiSelect3);
										relationshipUiSelect1 = '';
									    relationshipUiSelect2 = '';
									    relationshipUiSelect3 = '';
									};
									allViewCreate += superArray[afvs]+'</ui-select-match>\n             <ui-select-choices repeat="item._id as item in '+models[afvs]+' | propsFilter: {'+superArray2[afvs]+'}">'+superArray3[afvs]+'\n             </ui-select-choices>\n           </ui-select>';
								    relationshipViewCreate += '\n       '+'<div class="row">\n         <div class="form-group col-md-12">'+allViewCreate+'\n         </div>\n       </div>';
								    allViewCreate = '';
								//}
							}	
			
								relationshipCreateControllerCreate += '\n        '+''+modelB+'.'+models[afvs]+' = $scope.item.'+models[afvs]+';';
								relationshipCreateControllerEdit   += '\n        '+''+modelB+'Model.'+models[afvs]+' =  $scope.item.'+models[afvs]+';';
								relationshipCreateControllerAll    += '\n    '+''+models[afvs]+'Model.getAll().then(function(data) {\n      $scope.'+models[afvs]+' = data;\n    });';
								relationshipCreateControllerArg1   +=  '"'+models[afvs]+'Model"'+',';
								relationshipCreateControllerArg2   +=  ','+models[afvs]+'Model';
								modelConstructRelationship		   +=  '"'+models[afvs]+'"'+','; 
								modelBackEnd					   +=  '   '+''+models[afvs]+': { type: mongoose.Schema.ObjectId, ref: "'+models[afvs]+'" }'+',\n';
								routeBackendArg1				   +=  '\n'+'var '+models[afvs]+' = mongoose.model("'+models[afvs]+'");';
								routeBackendArg3				   +=  'if(typeof req.body.'+models[afvs]+'  != "undefined"){data.'+models[afvs]+' = req.body.'+models[afvs]+';}'+'\n     ';
								if(lll   >  (idRelationships.length-1)){
								//for (var acfvs = 0; acfvs < sindexFields.length; acfvs++) {
									indexFields = sindexFields[0].split("|");
									//indexFields = sindexFields[acfvs].split(",");
									for (var cfvs = 0; cfvs < (indexFields.length - 1); cfvs++) {
										tindexFields = indexFields[cfvs].split(",");
										for (var yop1 = 0; yop1 < (tindexFields.length); yop1++) {
									 		argumentsRelationshipViews += '{{item.'+models[cfvs]+'.'+tindexFields[yop1]+'}} ';         
										};
										superArray4.push(argumentsRelationshipViews);
										argumentsRelationshipViews = '';
									};
								//};
								};
								var upper = models[afvs].toUpperCase();
								indexViewsRelationships			   +=  '<td  at-sortable at-title="'+upper+'" width="150" >'+superArray4[afvs]+'</td>'+'\n           ';
								routeBackendArg2				   +=  '\n   .populate("'+models[afvs]+'")';
						};
						modelBackEnd    = modelBackEnd.slice(0,-2);
						cadDependencies = cadDependencies.slice(0,-1);
						injectModels	= injectModels.slice(0,-1);

						/* Relationships */


						/*		BACK END 		*/
						//Create routes/
						var vRoutes = "var meanCaseBase = require('../config/helpers/meanCaseBase.js');\nvar express = require('express');\nvar router = express.Router();\nvar mongoose = require('mongoose');\nvar "+crud+" = mongoose.model('"+crud+"');"+routeBackendArg1+"\nrouter.get('/"+crud+"/:id-:schema', function (req, res) {\n  var objTmp = {};\n  objTmp[req.params.schema] = req.params.id;\n  "+crud+".find(objTmp, function (err, data) {\n    res.json(data);\n  })\n})\n\nrouter.get('/"+crud+"/:id', function (req, res) {\n  "+crud+".findById(req.params.id, function (err, data) {\n    res.json(data);\n  })\n})\n/* GET "+crud+" listing. */\nrouter.get('/"+crud+"', function(req, res, next) {\n   "+modelB+".find()"+routeBackendArg2+"\n   .exec(function (err, results) {\n     res.status(200).send(results);\n     meanCaseBase.auditSave(req,'Query all Registers','"+crud+"','Query all Registers');\n   });\n});\n/* POST - Add "+crud+". */\nrouter.post('/"+crud+"', function(req, res, next){\n   var model = new "+crud+"(req.body);\n   model.save(function(err, data){\n     if(err){return next(err)}\n     res.json(data);\n     meanCaseBase.auditSave(req,'Insert Register','"+crud+"',data);\n   })\n});\n/* PUT - Update "+crud+". */\nrouter.put('/"+crud+"/:id', function(req, res){\n   "+crud+".findById(req.params.id, function(err, data){\n     "+routeBackendArg3+""+fields+"     data.save(function(err){\n       if(err){res.send(err)}\n       res.json(data);\n       meanCaseBase.auditSave(req,'Update Register','"+crud+"',data);\n     })\n   })\n});\n/* DELETE - "+crud+". */\nrouter.delete('/"+crud+"/:id', function(req, res){\n   "+crud+".findByIdAndRemove(req.params.id, function(err){\n     if(err){res.send(err)}\n     res.json({message: '"+crud+" delete successful!'});\n     meanCaseBase.auditSave(req,'Delete Register','"+crud+"','Id: '+req.params.id);\n   })\n});\nmodule.exports = router;";
						var wsRoutes = fs.createOutputStream('routes/'+crud+'.js');
						wsRoutes.write(vRoutes);
						//Create models/
						var vModels = "var mongoose = require('mongoose');\nvar "+crud+"Schema = new mongoose.Schema({\n"+fieldSchema+""+modelBackEnd+"\n});\nmongoose.model('"+crud+"', "+crud+"Schema);";
						var wsModels = fs.createOutputStream('models/'+crud+'.js');
						wsModels.write(vModels);

						/*		BACK END 		*/


						/*		FRONT END 		*/
						//Views Front
						var tdFields = '',divFields = '',createArguments = '',argService = '',argService2 = '',argService3 = '',fieldsModelDynamic = '';
						var contFixDate = 0;
						for (var z = 0; z < array.length; z++) {
							if(arrayShowOnView[z] != 'hidden' ){
								if(arrayTypes[z] == "Date" || arrayHtmlTypes[z] == 'time'){
									if(arrayTypes[z] == "Date"){
										tdFields += "<td  at-sortable at-title='"+arrayHeaders[z]+"' width='150' >{{item."+array[z]+" | date : 'MM-dd-yyyy'}}</td>\n           ";
									}else{
										tdFields += "<td  at-sortable at-title='"+arrayHeaders[z]+"' width='150' >{{item."+array[z]+" | date : 'HH:mm:ss'}}</td>\n           ";
									}
									
								}else{
									tdFields += "<td  at-sortable at-title='"+arrayHeaders[z]+"' width='150'>{{item."+array[z]+"}}</td>\n           ";
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
						//Views Front
						var vIndex = '<div class="container-fluid">\n   <div class="row div-padding">\n     <button ng-click="open()" class="btn btn-default "><i class="fa fa-plus"></i> Create New</button>\n     <div class="alert alert-{{alert}}" ng-show="msjAlert">{{message}}</div>\n   </div>\n   <div class="row">\n     <div class="input-group">\n       <span class="input-group-addon" id="basic-addon1"><i class="fa fa-search"></i></span>\n       <input ng-model="searchText" type="text" class="form-control" placeholder="Search" aria-describedby="basic-addon1">\n     </div>\n     <table ng-hide="preloader" class="table table-bordered table-hover table-striped" at-table at-paginated at-list="'+crud+'List | filter:searchText" at-config="configTable">\n       <thead></thead>\n       <tbody>\n         <tr>\n           '+tdFields+'\n           '+indexViewsRelationships+'\n           <td  at-title="Acción" width="250"><button type="button" class="btn btn-default" ng-click="open(item)"><i class="fa fa-pencil-square-o"></i></button><button type="button" class="btn btn-default" ng-click="openDelete(item)"><i class="fa fa-trash-o"></i></button></td>\n         </tr>\n       </tbody>\n     </table>\n     <div class="col-md-6 col-md-offset-3" ><at-pagination ng-hide="preloader" at-list="'+crud+'List" at-config="configTable"></at-pagination></div>\n     <div class="row col-lg-offset-6 col-md-offset-6 col-xs-offset-6" ng-hide="!preloader"><i class="fa fa-spinner fa-spin fa-5x position-spinner"></i></div>\n   </div>\n</div>';
						var wsIndex = fs.createOutputStream('public/templates/'+crud+'/index.html');
						wsIndex.write(vIndex);

						var vDelete = '<div class="modal-header">\n   <h3 class="modal-title">¿Está seguro?</h3>\n</div>\n<div class="modal-body clearfix">\n   <i class="pull-left fa fa-trash-o fa-3x" />\n   <div class="pull-left">\n     ¿Está seguro que desea borrar el Registro?\n     <div>\n       <h4>{{item.'+array[0]+'}}</h4>\n     </div>\n   </div>\n</div>\n<div class="modal-footer">\n   <button ng-hide="deleting" class="btn btn-default" ng-click="$dismiss()">Cancelar</button>\n    <button autoselect class="btn btn-default" type="button" ng-click="ok()"><span ng-hide="deleting">Eliminar</span><i ng-show="deleting" class="fa fa-spinner fa-spin"></i></button>\n</div>';
						var wsDelete = fs.createOutputStream('public/templates/'+crud+'/modalDelete.html');
						wsDelete.write(vDelete);

						var vCreate = '<div class="modal-header">\n   <div class="pull-right">\n     <button type="button" class="close pull-right" ng-click="$dismiss()">&times;</button>\n   </div>\n<div>\n   <h3 class="modal-title" ng-if="!item._id">Create</h3>\n   <h3 class="modal-title" ng-if="item._id">Edit</h3>\n</div>\n</div>\n<div>\n<form name="myForm" ng-submit="save()" method="POST">\n   <div class="modal-body">\n     <fieldset>\n       '+divFields+''+relationshipViewCreate+'\n     </fieldset>\n</div>\n<div class="modal-footer">\n   <button ng-disabled="myForm.$invalid || myForm.$pristine" class="btn btn-primary pull-right" type="submit" title="Save"><span ng-if="saving"><i class="fa fa-spinner fa fa-spin"></i>&nbsp;</span><span>Save</span></button>\n</div>\n</form>\n</div>';
						var wsCreate = fs.createOutputStream('public/templates/'+crud+'/modalCreate.html');
						wsCreate.write(vCreate);

						//Controllers Front

						var vIndexController = ".controller('"+crud+"Controller',\n  ['$rootScope','$scope', '$location', '"+crud+"Model','$uibModal',\n  function ($rootScope,$scope, $location, "+crud+"Model,$uibModal) {\n    $scope.titleController = 'MEAN-CASE SUPER HEROIC';\n    $rootScope.titleWeb = '"+crud+"';\n    $scope.preloader = true;\n    $scope.msjAlert = false;\n    "+crud+"Model.getAll().then(function(data) {\n      $scope."+crud+"List = data;\n      $scope."+crud+"Temp = angular.copy($scope."+crud+"List);\n      $scope.preloader = false;\n    });\n    /*  Modal */\n     $scope.open = function (item) {\n       var modalInstance = $uibModal.open({\n        animation: true,\n        templateUrl: 'templates/"+crud+"/modalCreate.html',\n        controller: 'modal"+crud+"CreateController',\n        size: 'lg',\n        resolve: {\n         item: function () {\n          return item;\n         }\n        }\n      });\n      modalInstance.result.then(function(data) {\n           "+modelB+"Model.getAll().then(function(d) {\n             $scope."+modelB+"List = d;\n             $scope."+modelB+"Temp = angular.copy($scope."+modelB+"List);\n           });\n      },function(result){\n      $scope."+crud+"List = $scope."+crud+"Temp;\n      $scope."+crud+"Temp = angular.copy($scope."+crud+"List);\n    });\n  };\n  /*  Delete  */\n  $scope.openDelete = function (item) {\n    var modalInstance = $uibModal.open({\n      animation: true,\n      templateUrl: 'templates/"+crud+"/modalDelete.html',\n      controller: 'modal"+crud+"DeleteController',\n      size: 'lg',\n      resolve: {\n        item: function () {\n           return item;\n        }\n      }\n    });\n    modalInstance.result.then(function(data) {\n      var idx = $scope."+crud+"List.indexOf(data);\n      $scope."+crud+"List.splice(idx, 1);\n      "+crud+"Model\n        .destroy(data._id)\n        .then(function(result) {\n          $scope.msjAlert = true;\n          $scope.alert = 'success';\n          $scope.message = result.message;\n        })\n        .catch(function(err) {\n          $scope.msjAlert = true;\n          $scope.alert = 'danger';\n          $scope.message = 'Error '+err;\n        })\n      });\n    };\n}])";
						var wsIndexController = fs.createOutputStream('public/javascripts/controllers/'+crud+'/indexController.js');
						wsIndexController.write(vIndexController);
						
						var vDeleteController  = ".controller('modal"+crud+"DeleteController',\n  ['$scope', '$uibModalInstance', 'item',\n  function ($scope, $uibModalInstance, item) {\n    $scope.item = item;\n    $scope.ok = function () {\n      $uibModalInstance.close($scope.item);\n    };\n    $scope.cancel = function () {\n       $uibModalInstance.dismiss('cancel');\n     };\n}])";
						var wsDeleteController = fs.createOutputStream('public/javascripts/controllers/'+crud+'/modal'+crud+'DeleteController.js');
						wsDeleteController.write(vDeleteController);
					
						var vCreateController  = ".controller('modal"+crud+"CreateController',\n  ['$scope', '$uibModalInstance', 'item','"+crud+"Model','$filter',"+relationshipCreateControllerArg1+"\n  function ($scope, $uibModalInstance, item,"+crud+"Model,$filter"+relationshipCreateControllerArg2+") {\n    $scope.item = item;\n    $scope.saving = false;\n    if(item){"+dateFix+"\n       //add optional code\n    }\n    $scope.save = function () {\n      if(!item){\n        $scope.saving = true;\n        item = {"+argService3+"};\n        var "+crud+" = "+crud+"Model.create();"+relationshipCreateControllerCreate+""+createArguments+"\n        "+crud+".save().then(function(r){\n          $scope.saving = false;\n          $uibModalInstance.close(r);\n        });\n      }else{"+controllerFixDate+"\n        "+crud+"Model.findById($scope.item._id);"+relationshipCreateControllerEdit+""+fieldsModelDynamic+"\n        "+crud+"Model.save().then(function(r){\n          $scope.saving = false;\n          $uibModalInstance.close(r);\n        });\n      }\n    };"+relationshipCreateControllerAll+"\n}])";
						var wsCreateController = fs.createOutputStream('public/javascripts/controllers/'+crud+'/modal'+crud+'CreateController.js');
						wsCreateController.write(vCreateController);
						
						var vServise  = ".service('"+crud+"Model', function ($optimumModel,"+injectModels+") {\n  var model = new $optimumModel();\n  model.url = '/api/"+crud+"';\n  model.constructorModel = ["+modelConstructRelationship+""+argService2+"];\n model.dependencies = {"+cadDependencies+"};\n  return model;\n})";
						var wsServise = fs.createOutputStream('public/javascripts/models/'+crud+'Model.js');
						wsServise.write(vServise);
						
						/*		FRONT END 		*/
					} else if (cardinalitie == 1) {
						console.log("Aqui va la relacion una a una");
					}else{
						console.log("Aqui va la relacion una a muchas")
					}
				})
			});
		}
	  	return true;
	  };
	  return meanCase;
})(typeof exports === "undefined" ? meanCase = {} : exports);