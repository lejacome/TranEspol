var loginAccessRoutes = {
	noLoginRoutes:'/api/libros:POST|/api/controles', //This is a example use
	isRoot:'',
	isAdmin:'/api/Audit:GET',
	isCoordinator:'',
	isEdit:'',
	isReader:'/api/users:GET'
};
module.exports = loginAccessRoutes;