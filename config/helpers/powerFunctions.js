
(function(powerFuctions){
	powerFuctions.unless  = function(expression,result){
		  arrayExpression = expression.split(",");
		  var operators 	= ['>','<','>=','<=','equal','different','and','or','not'];
		  var operatorsRep  = ['>','<','>=','<=','===','!==','&&','||','!'];
		  for (var i in operators) {
		  	arrayExpression[0] = arrayExpression[0].replace(new RegExp(operators[i], 'g'), operatorsRep[i]);
		  };
		  if(!eval(arrayExpression[0]))
		  	return result;
	};

})(typeof exports === "undefined" ? powerFuctions = {} : exports);
