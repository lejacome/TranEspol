var loginAccessRoutes = {
	noLoginRoutes:'/api/libros:POST|/api/controles|/api/rutas:GET|api/objetos|api/comentarios', //This is a example use
	isRoot:'',
	isAdmin:'/api/Audit:GET',
	isCoordinator:'',
	isEdit:'',
	isReader:'/api/users:GET'
};
module.exports = loginAccessRoutes;
