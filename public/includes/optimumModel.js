
var app = angular.module("optimumModel", []);

app.factory("$optimumModel", function($q,$http)
{
	this.url = '';
    this.idd = '';
    this.isUpdate = false;
    this.constructorModel;
    var methods = [];
    // instantiate our initial object
    var optimumModel = function() {
        this.initialize.apply(this, arguments);
    };

    if (!optimumModel.prototype.initialize) optimumModel.prototype.initialize = function(){};

    optimumModel.prototype.getAll = function() {
    	var defered = $q.defer();
        var promise = defered.promise;
        $http.get(this.url)
            .success(function(data) {
                defered.resolve(data);
            })
            .error(function(err) {
                defered.reject(err)
            });
        return promise;
    };
    function createConstruct(methods,uri){
        for (var property in methods) {
            var tmp = methods[property];
            optimumModel.prototype[tmp] = "/empty/";
        }
        optimumModel.prototype['url'] = uri ;
    }
    optimumModel.prototype.create = function(){
        this.isUpdate = false;
        var methods = this.constructorModel;
        createConstruct(methods,this.url);
        return optimumModel.prototype;
    };
    optimumModel.prototype.findById = function(id){
        this.isUpdate = true;
        this.idd = id;
        var methods = this.constructorModel;
        createConstruct(methods,this.url);
        var defered = $q.defer();
        var promise = defered.promise;
        var listRsult = [];
        if(this.dependencies){
            var dependecies = this.dependencies;
        }else if (this.collections) {
            var collections = this.collections;
            var cutUrl      = this.url;
            cutUrl          = cutUrl.replace("/api/", "");
        }
        $http.get(this.url+'/'+id)
            .success(function(data) {
                if(dependecies){
                    var cont = 0;
                    var sizeDependecies = Object.keys(dependecies).length;
                    angular.forEach(dependecies, function(value, key) {
                        var tmpString = 'data.'+key;
                        $http.get(value+'/'+eval(tmpString))
                           .success(function(r) {
                                cont++;
                                listRsult.push({name:key,container:r});
                                if(cont >= sizeDependecies){
                                   angular.forEach(listRsult, function(value, key) {
                                        if(key >= 0){
                                            data[value.name]  = value.container;
                                        }
                                    });
                                    defered.resolve(data);
                                }
                        })
                    });

                }else if (collections) {
                    var cont = 0;
                    angular.forEach(collections, function(value) {
                        $http.get('api/'+value+'/'+data._id+'-'+cutUrl)
                               .success(function(r) {
                                    cont++;
                                    listRsult.push({name:value,container:r});
                                    if(cont >= collections.length){
                                        angular.forEach(listRsult, function(value, key) {
                                            if(key >= 0){
                                                data[value.name]  = value.container;
                                            }
                                        });
                                        defered.resolve(data);
                                    }
                        })
                    })
                }else{
                     defered.resolve(data);
                }

            })
            .error(function(err) {
                defered.reject(err)
            });
        return promise;
        //return optimumModel.prototype;
    };
    optimumModel.prototype.destroy = function(id){
        var methods = this.constructorModel;
        createConstruct(methods);
        var defered = $q.defer();
        var promise = defered.promise;
        $http.delete(this.url+'/'+id)
            .success(function(data) {
                defered.resolve(data);
            })
            .error(function(err) {
                defered.reject(err)
            });
        return promise;
    };
    optimumModel.prototype.save = function(){
        var c = optimumModel.prototype;
        var comp = [];
        angular.forEach(c, function(value, key) {
            if(typeof value !== "function"){
                 comp.push(key);
            }
        });
        var tmp = '',obj2 = '';
        for (co in comp) {
            tmp = eval('this.'+comp[co]);
            if(tmp != '/empty/'){
                obj2 += comp[co]+ ': '+'this.'+comp[co]+',';
            }
        };
        obj2 = obj2.slice(0,-1);
        var parameters2 =  eval('({' + obj2 + '})');
        //Promise Ajax Insert
        var defered = $q.defer();
        var promise = defered.promise;
        if(!this.isUpdate){
           $http.post(this.url,parameters2)
            .success(function (data, status) {
              defered.resolve(data);
            })
            .error(function (data) {
              defered.reject();
            });
            return promise;
        }else{
            $http.put(this.url+'/'+this.idd,parameters2)
                .success(function (data, status) {
                  defered.resolve(data);
                })
                .error(function (data) {
                  defered.reject();
                });
            return promise;
        }


    };
    return optimumModel;


});
