const path = require('path');
module.exports = [];
module.exports = [{
	'path': '/session',
	'controller': 'UserController',
	'method': ['POST'],
	'callback': 'checkLogin',
	'auth': false,
},{
	'path': '/session',
	'controller': 'UserController',
	'method': ['DELETE'],
	'callback': 'logout',
	'auth': true,
},{
	'path': '/main/product/category',
	'controller': 'ProductCategoryController',
	'method': ['GET'],
	'callback': 'list',
	'auth': false,
},{
	'path': '/main/product',
	'controller': 'ProductController',
	'method': ['GET'],
	'callback': 'list',
	'auth': false,
}];