
var is = require('./dataTypes.js');
var validationTRANS = function(){
  this.objectTypeDate = arguments[0];
}

validationTRANS.prototype.pass = function(){
  this.values = arguments[0];
  var flag = true,field = '',datatype = '';
  for (var prop in this.objectTypeDate) {
  	var arrayArguments =  this.objectTypeDate[prop].split("|");
  	for (var i in arrayArguments) {
	  	pos  = arrayArguments[i].indexOf(".");
	  	if(pos != -1){
	  		size     = arrayArguments[i].length;
			first    = arrayArguments[i].slice(0, pos);
			second   = arrayArguments[i].slice(pos+1, size);
			if(!is[first][second](this.values[prop])){
		  		flag = false;
		  		field += prop + ',';
		  		datatype += arrayArguments[i] + ',';
		  	}
	  	}else{
		  	if(!is[arrayArguments[i]](this.values[prop])){
		  		flag = false;
		  		field += prop + ',';
		  		datatype += arrayArguments[i] + ',';
		  	}
		}
	}

  };
  datatype = datatype.slice(0,-1);
  field = field.slice(0,-1);
  return {valid:flag,field:field,datatype:datatype};
};
module.exports = exports = validationTRANS;
