var AbstractClass = require('../../model/AbstractClass');
const global = require('../../config/config');
var DBC =  require('mongodb');
module.exports = AbstractClass.extend({
	DBC: DBC,
    model: null,
    params: null,
	initialize : function(model, params) {
		var me = this;
		me.model = model;
		me.params = params;
		me.set('conf', {
			host: params.ip,
			database: params.database,
			port: params.port,
			user: params.user,
			pass: params.pass
		});
	},
	connect: function(callback){
		var me = this;
		return new Promise(function(resolve, reject){
			var MongoClient = me.DBC.MongoClient;
			var connection = new MongoClient;
			if(!me.params.auth){
				var url = 'mongodb://' + me.get('conf').host + ':' + me.get('conf').port + '/' + me.get('conf').database;
			}else{
				var url = 'mongodb://' +  me.get('conf').user + ':' + me.get('conf').pass + '@' + me.get('conf').host + ':' + me.get('conf').port + '/' + me.get('conf').database;
			}
			MongoClient.connect(url,{ 
				useNewUrlParser: true 
			}, function(err, db) {
			    if (err){ 
			    	console.error(err.stack);
			    	reject(err);
			    	return;
			    }
				var _db = db.db(me.get('conf').database);
				_db.close = db.close;
			    resolve(_db);
			});
		});
	},
	getCount: function(conditions){
		var me = this;
		return new Promise(function(resolve, reject){
			me.connect().then(function(db){
				var collection = db.collection(me.model.getTablename());
				collection.countDocuments(conditions, function(err, docs) {
					db.close();
					if(err) {
						reject(err);
						return;
					}
					resolve(docs);
				});
			}).catch(function(e){
				reject(e);
			});
		});
	},
	findBy: function(cond, order, skip, limit){
		var me = this;
		return new Promise(function(resolve, reject){
			me.connect().then(function(db){
				var collection = db.collection(me.model.getTablename());
				var sparam = {};
				if(order){
					sparam.sort = order;		
				}
				var builder = collection.find(cond, sparam);
				if(skip != undefined && limit != undefined){
					builder.skip(skip).limit(limit);
				}
				builder.toArray(function(err, docs) {
					db.close();
					if(err) {
						reject(err);
						return;
					}
					resolve(docs);
				});
			}).catch(function(e){
				reject(e);
			});
		});
	},
	save: function(values){
		var me = this;
		return new Promise(function(resolve, reject){
			me.connect().then(function(db){
				var collection = db.collection(me.model.getTablename());
				collection.insert(values, {
					w:1
				}, function(err, result) {
					db.close();
					if(err) {
						reject(err);
						return;
					}
					resolve({ id: result.insertedIds[0]});
				});
			}).catch(function(e){
				reject(e);
			});
		});
	},
	findOneAndUpdate: function(cond, values){
		var me = this;
		return new Promise(function(resolve, reject){
			me.connect().then(function(db){
				var collection = db.collection(me.model.getTablename());
				collection.findOneAndUpdate(cond, {
					$set: values,
				}, null, function(err, docs) {
					db.close();
					if(err) {
						reject(err);
						return;
					}
					resolve(docs ? docs.value : null);
				});
			}).catch(function(e){
				reject(e);
			});
		});
	},
	update: function(cond, values, callback){
		var me = this;
		return new Promise(function(resolve, reject){
			me.connect().then(function(db){
				var collection = db.collection(me.model.getTablename());
				collection.update(cond, {
					$set: values,
				}, function(err, r) {
					db.close();
					if(err) {
						reject(err);
						return;
					}
					resolve(r);
				});
			}).catch(function(e){
				reject(e);
			});
		});
	},
	remove: function(cond, callback){
		var me = this;
		return new Promise(function(resolve, reject){
			me.connect().then(function(db){
				var collection = db.collection(me.model.getTablename());
				collection.removeOne(cond, {w:1}, function(err, r) {
					db.close();
					if(err) {
						reject(err);
						return;
					}
					resolve();
				});
			}).catch(function(e){
				reject(e);
			});
		});
	},
	createListReaderItem: function(listid, total){
		var me = this;
		return new Promise(function(resolve, reject){
			me.connect().then(function(db){
				var collection = db.collection('filereaderitem');
				collection.insert([{
					'list': listid,
					'total': total,
					'inserted_mongo': 0,
					'finish': false
				}], {w:1}, function(err, result) {
					db.close();
					if (err){
						reject(err);
					};
					resolve({
						'id':result['ops'][0]['_id']
					});
				});
			}).catch(function(e){
				reject(e);
			});
		});
	},
	getFileReaderItem: function(item){
		var me = this;
		return new Promise(function(resolve, reject){
			me.connect().then(function(db){
				var collection = db.collection('filereaderitem');
				collection.find({
					"_id": new me.DBC.ObjectID(item),
				}).toArray(function(err, docs) {
					db.close();
					if(err) {
						reject(err);
						return;
					}
					resolve(docs);
				});
			}).catch(function(e){
				reject(e);
			});
		});
	},
	finishFileReaderItem: function(item, callback){
		var me = this;
		return new Promise(function(resolve, reject){
			me.connect().then(function(db){
				var collection = db.collection('filereaderitem');
				collection.update({ 
					'_id': new me.DBC.ObjectID(item),
				}, {
					$set: { 
						finished: true,
					}
				}, function(err, r) {
					db.close();
					if(err) {
						reject(err);
						return;
					}
					resolve();
				});
			}).catch(function(e){
				reject(e);
			});
		});
	},
	getLeadsFromPhones: function(phones, companyid, callback){
		var me = this;
		return new Promise(function(resolve, reject){
			me.connect().then(function(db){
				var collection = db.collection(me.model.getTablename());
				var query = {
					"company.companyid": companyid,
					"phonenumber": {
						'$in': phones,
					}
				};
				collection.find(query).toArray(function(err, docs) {
					db.close();
					if(err) {
						reject(err);
						return;
					}
					resolve(docs);
				});
			}).catch(function(e){
				reject(e);
			});
		});
	},
	registerLead: function(data, callback){
		var me = this;
		return new Promise(function(resolve, reject){
			me.connect().then(function(db){
				var collection = db.collection(me.model.getTablename());
				collection.update({
			    	phonenumber: data['phone']
				}, data, {
			    	upsert: true, 
			    	safe: false
			    }, function(err,data){
			    	db.close();
					if(err) {
						reject(err);
						return;
					}
					resolve(data);
			    });
			}).catch(function(e){
				reject(e);
			});
		});
	},
	createleads: function(leads){
		var me = this;
		return new Promise(function(resolve, reject){
			me.connect().then(function(db){
				var collection = db.collection(me.model.getTablename());
				collection.insert(leads, {
					w:1
				}, function(err, result) {
					db.close();
					if(err) {
						console.trace(err)
						reject(err);
						return;
					}
					resolve();
				});
			}).catch(function(e){
				console.trace(e)
				reject(e);
			});
		});
	},
	incrementInsertedOnListItem: function(recid, count_mongo){
		var me = this;
		return new Promise(function(resolve, reject){
			me.connect().then(function(db){
				var collection = db.collection('filereaderitem');
				var updated = {};
				if(count_mongo != null){
					updated = {
						$inc: {
							"inserted_mongo": count_mongo
						}
					}
				};
				
				collection.update({ 
					'_id': new me.DBC.ObjectID(recid),
				}, updated, function(err, r) {
					db.close();
					if(err) {
						reject(err);
						return;
					}
					resolve();
				});
			}).catch(function(e){
				reject(e);
			});
		});
	},
	saveListReaderError: function(documents, callback){
		var me = this;
		return new Promise(function(resolve, reject){
			me.connect().then(function(db){
				var collection = db.collection('ListItemError');
				collection.insertMany(documents, function(err, result) {
					db.close();
					if(err) {
						reject(err);
						return;
					}
					resolve();
				});
			});
		});
	},
});