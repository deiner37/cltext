var Controller = require('../model/CRUDController');
module.exports = Controller.extend({
	documentName: 'ProductCategory',
	slug: 'admin/product/categories',
	className: 'ProductCategoryController',
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