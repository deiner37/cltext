var Controller = require('../model/AbstractController');
var DocumentManager = require('../lib/DocumentManager');
var _ = require('underscore');
module.exports = Controller.extend({
	model: null,
	documentName: null,
	slug:null,
	documentManager:null,
	className: 'CRUDController',
	routes: {
		'list':{
			path: '/',
			method: 'GET',
			auth: true,
			callback: 'list'
		},
		'getEntity':{
			path: '/:id',
			method: 'GET',
			auth: true,
			callback: 'getById'
		},
		'update':{
			path: '/:id',
			method: 'PUT',
			auth: true,
			callback: 'update'
		},
		'remove':{
			path: '/:id',
			method: 'DELETE',
			auth: true,
			callback: 'remove'
		},
		'save':{
			path: '/',
			method: 'POST',
			auth: true,
			callback: 'save'
		}
	},
	initialize: function(app){
		var me = this;
		me.app = app;
		me.app.get('document_manager').getDocumentByClassName(me.documentName).then(function(Document){
			me.model = Document;
		});
	},
	remove: function(req, res){
		var me = this;
		var data = me.getRequestData(req);
		var model = me.model;
		var query = {};
		if(!req.params.id) throw "Invalid identifier";
		var pkeys = model.primaryKeys;
		query[_.keys(pkeys)[0]] = req.params.id;
		me.app.get('document_manager').getRepository(me.documentName).then(function(repo){
			repo.find(req.params.id).then(entity => {
				if(!entity){
					res.status(400).json({
						'message': "Entity not found"
					})
					return;
				}
				var success = function(data, document){
					return new Promise(function(resolve, reject){
						document.deleted = true;
						repo.update(document);
						resolve();
					});
				}
				if(_.isFunction(me.beforeDelete)){
					me.beforeDelete(data, entity).then(function(data){
						success(me, data.data, data.model).then(function(){
							res.status(200).json({
								'message': 'Entity has been deleted successfully',
							});
						});
					}).catch(function(error){
						console.log(error);
						res.status(500).json({
							'message': error.stack,
						})

					});
				}else{
					success(data, entity).then(function(){
						res.status(200).json({
							'message': 'Entity has been deleted successfully',
						});
					});
				}
			});
		});
	},
	update: function(req, res){
		var me = this;
		var data = me.getRequestData(req);
		var model = me.model;
		if(!req.params.id) throw "Invalid identifier";
		if(_.isEmpty(data)) throw "No value for update";
		let query = {};
		var pkeys = model.primaryKeys;
		query[_.keys(pkeys)[0]] = req.params.id;
		me.app.get('document_manager').getRepository(me.documentName).then(function(repo){
			repo.find(req.params.id).then(entity => {
				if(!entity){
					res.status(400).json({
						'message': "Entity not found"
					})
					return;
				}

				/*let exclude =  (me.excludeExtra && me.excludeExtra.length > 0) ? _.union(me.model.excludeAttr, me.excludeExtra) : me.model.excludeAttr;
				_.each(data, function(v, k){
					if(_.indexOf(exclude, k) > -1){
						delete data[k];
					}
				});*/
				
				var success = function(data, document){
					return new Promise(function(resolve, reject){
						document.setObject(data);
						repo.update(document);
						resolve(document);
					});
				}

				if(_.isFunction(me.beforeUpdate)){
					me.beforeUpdate(data, entity).then(function(data){
						success(data, entity).then(function(document){
							if(_.isFunction(me.afterUpdate)){
								me.afterUpdate(document).then(function(e){
									res.status(200).json({
										'message': 'Entity has been updated successfully',
									})
								});
							}else{
								res.status(200).json({
									'message': 'Entity has been updated successfully',
								})
							}
						});
					}).catch(function(error){
						console.log(error);
						res.status(500).json({
							'message': error.stack,
						})

					});
				}else{
					success(data, entity).then(function(document){
						if(_.isFunction(me.afterUpdate)){
							me.afterUpdate(document).then(function(e){
								res.status(200).json({
									'message': 'Entity has been updated successfully',
								})
							});
						}else{
							res.status(200).json({
								'message': 'Entity has been updated successfully',
							})
						}
					});
				}

			});
		});
	},
	save: function(req, res){
		var me = this;
		var data = me.getRequestData(req);
		var model = me.model;
		if(data['id']) delete data['id'];
		if(_.isEmpty(data)) throw "No value for save";
		me.app.get('document_manager').getRepository(me.documentName).then(function(repo){
			me.app.get('document_manager').getDocumentByClassName(me.documentName).then(function(Document){
				let newDocument = new Document();
				newDocument.setObject(data);
				if(_.isFunction(me.beforeSave)){
					me.beforeSave(newDocument).then(function(newentity){
						repo.save(newentity).then(function(){
							if(_.isFunction(me.afterSave)){
								me.afterSave(newentity).then(function(e){
									res.status(201).json({
										'message': 'Entity has been saved successfully',
										'id': e.get('id')
									});
								});
							}else{
								res.status(201).json({
									'message': 'Entity has been saved successfully',
									'id': newentity.get('id')
								});
							}
						})
					}).catch(function(error){
						console.log(error);
						res.status(500).json({
							'message': error,
						});
					});
				}else{
					repo.save(newDocument).then(function(){
						if(_.isFunction(me.afterSave)){
							me.afterSave(newDocument).then(function(e){
								res.status(201).json({
									'message': 'Entity has been saved successfully',
									'id': e.get('id')
								});
							});
						}else{
							res.status(201).json({
								'message': 'Entity has been saved successfully',
								'id': newDocument.get('id')
							});
						}
					});
				}
			});
		});
	},
	list: function(req, res){
		var me = this;
		var data = me.getRequestData(req);
		var page = data.page || 0;
		let limit = data.per_page || 100;
		limit = _.isString(limit) ? parseInt(limit) : limit;
		page = _.isString(page) ? parseInt(page) : page;
		var start = page * limit;
		var query = {
			'deleted': false
		};
		me.app.get('document_manager').getRepository(me.documentName).then(function(repo){
			if(me.beforeList){
				me.beforeList(query, data).then(function(query){
					repo.findBy(query, null, start, limit).then(entities => {
						repo.getCount(query).then(count => {
							var params = {
								data: entities,
								total: count,
							};
							if(me.afterList){
								me.afterList(params).then(function(data){
									res.status(200).json(data);
								}).catch(function(e){
									console.log(error);
									res.status(500).json({
										'message': error,
									});
								});
							}else{
								res.status(200).json(params);
							}
						});
					});
				}).catch(function(e){
					console.log(error);
					res.status(500).json({
						'message': error,
					});
				});
			}else{
				repo.findBy(query, null, start, limit).then(entities => {
					repo.getCount().then(count => {
						var params = {
							data: entities,
							total: count,
						};
						if(me.afterList){
							me.afterList(params).then(function(data){
								res.status(200).json(data);
							}).catch(function(e){
								console.log(error);
								res.status(500).json({
									'message': error,
								});
							});
						}else{
							res.status(200).json(params);
						}
					});
				});
			}
		});
	},
	getById: function(req, res){
		var me = this;
		var data = me.getRequestData(req);
		var page = data.page || 1;
		var start = (page - 1) * me.limit;
		var query = {
			'deleted': false
		};
		var model = me.model;
		_.each(data.filter, function(val, key){
			if(model.hasProperty(key)){
				query[key] = val;
			}
		});
		if(!req.params.id) throw "Invalid identifier";
		var pkeys = model.primaryKeys;
		query[_.keys(pkeys)[0]] = req.params.id;

		me.app.get('document_manager').getRepository(me.documentName).then(function(repo){
			repo.find(req.params.id).then(entity => {
				if(!entity){
					res.status(400).json({
						'message': "Entity not found"
					})
					return;
				}

				if(_.isFunction(me.beforeGetById)){
					me.beforeGetById(entity).then(function(resp){
						res.status(200).json(resp);
					});
				}else{
					res.status(200).json(entity);
				}
			});
		});
	}
});
