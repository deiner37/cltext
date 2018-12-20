var Controller = require('../model/CRUDController');
module.exports = Controller.extend({
	documentName: 'Product',
	slug: 'admin/product',
	className: 'ProductController',
	routes: {
		/*'password': {
			path: '/password/:id',
			method: 'PUT',
			auth: true,
			callback: 'password'
		},
		'enableordisable':{
			path: '/ed/:id',
			method: 'PUT',
			auth: true,
			callback: 'enableordisable'
		},*/
	}
});