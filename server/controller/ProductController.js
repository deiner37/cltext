var Controller = require('../model/CRUDController');
module.exports = Controller.extend({
	documentName: 'Product',
	slug: 'main/product',
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
	},
	beforeList: function(query, params){
		let me = this;
		return new Promise(function(resolve, reject){
			if(params.category && params.category != ""){
				query['category_id'] = params.category;
			}
			if(params.pn && params.pn != ""){
				query['name'] = { $regex : ".*" + params.pn + ".*"};
			}
			resolve(query);
		});
	}
});