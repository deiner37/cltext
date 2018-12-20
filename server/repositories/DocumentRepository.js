_ = require('underscore');
AbstractClass = require('../model/AbstractClass');
var moment = require('moment');
var DBC =  require('mongodb');
module.exports = AbstractClass.extend({
    model: null,
    app: null,
    dbconnector: null,
    className: 'DocumentRepository',
    initialize: function(model, app){
		this.model = model;
		this.app = app;
		var Connector = require('../lib/DBConnector/MongoConnector');
		this.dbconnector = new Connector(this.model, this.app.get("settings").database.mongo);
	},
	findAll: function(skip, limit, order){
		var me = this;
		var conf = {};
		return new Promise(function(resolve, reject){
			me.findBy(conf, order, skip, limit).then(function(rows){
				resolve(rows);
			}).catch(function(e){
				reject(e);
			});
		});
	},
	find: function(id){
		var me = this;
		var table = me.model.getTablename();
		var conf = {};
		conf[me.model.getColnameFromProperty(this.model.identifier)] = new DBC.ObjectID(id);
		return new Promise(function(resolve, reject){
			me.findBy(conf, null, 0, 1).then(function(rows){
				if(rows.length > 0) rows = rows[0];
				else rows = null;
				resolve(rows);
			}).catch(function(e){
				reject(e);
			});
		});
	},
	findBy: function(conditions, order, skip, limit){
		var me = this;
		if(_.isFunction(order)){
			callback = order;
			order = null;
			skip = null;
			limit = null;
		}
		if(!conditions) conditions = {};
		return new Promise(function(resolve, reject){
			me.dbconnector.findBy(conditions, order, skip, limit).then(function(rows){
				resolve(rows);
			}).catch(function(e){
				reject(e);
			});
		});
	},
	getCount: function(conditions){
		var me = this;
		if(_.isFunction(conditions)){
			callback = conditions;
			conditions = {};
		}
		return new Promise(function(resolve, reject){	
			me.dbconnector.getCount(conditions).then(function(count){
				//console.log("Mongo Count: " + count);
				resolve(count);
			}).catch(function(e){
				console.trace(e);
				reject(e);
			});
		});
	},
	parseRow: function(row, model){
		var newrow = {};
		_.each(row, function(val, key){
			var relChecker = key.split("__");
			//console.log(key, _.keys(relChecker).length, relChecker[0], model.hasProperty(relChecker[0]));
			if(_.keys(relChecker).length > 1 && model.hasProperty(relChecker[0])){
				if(!newrow[relChecker[0]]) newrow[relChecker[0]] = {};
				newrow[relChecker[0]][relChecker[1]] = val; 
			}else{
				newrow[key] = val;
			}
		});
		return newrow;
	},
	findOneBy: function(conditions){
		var me = this;
		return new Promise(function(resolve, reject){
			me.findBy(conditions, null, 0, 1).then(function(rows){
				if(rows && _.keys(rows).length > 0){
					resolve(rows[0]);
					return;
				}
				resolve(null);
			}).catch(function(e){
				console.log("NULL");
				reject(e);
			});
		});
	},
	save: function(model){
		var me = this;
		return new Promise(function(resolve, reject){	
            let values = model.getValues();
			me.dbconnector.save(values).then(function(data){
				model.set(model.identifier, data.id);
				resolve(data);
			}).catch(function(e){
				reject(e);
			});
		});
	},
	update: function(model){
		var me = this;
		var cond = {};
		cond[me.model.getColnameFromProperty(this.model.identifier)] =  model.get(me.model.identifier);
		let values = model.getValues();
		//console.log("\n\nUPDATE VALUES  FOR " +  model.className + " :", values);
		return new Promise(function(resolve, reject){	
			me.dbconnector.update(cond, values).then(function(){
				resolve();
			}).catch(function(e){
				console.log(e);
				reject(e);
			});
		});
	},
	remove: function(model){
		var me = this;
		var cond = {};
		cond[me.model.getColnameFromProperty(this.model.identifier)] =  model.get(me.model.identifier);
		return new Promise(function(resolve, reject){	
			me.dbconnector.remove(cond).then(function(){
				resolve();
			}).catch(function(e){
				reject(e);
			});
		});
	}
});