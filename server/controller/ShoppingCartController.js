var Controller = require('../model/CRUDController');
module.exports = Controller.extend({
	documentName: 'ShopingCart',
	slug: 'shopingcart',
	className: 'ChoppingCartController',
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