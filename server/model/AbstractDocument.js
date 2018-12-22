_ = require('underscore');
AbstractClass = require('./AbstractClass');
var moment = require('moment');
module.exports = AbstractClass.extend({
    identifier: 'id',
	identifierDB: '_id',
	className: 'AbstractDocument',
	repository: 'DocumentRepository',
    attributes:{},
	values:{},
    removeComplete: false,
    initialize: function(){
		var me = this;
		me.values = {};
		_.each(me.attributes, function(attr, name){
			if(attr['default'] != undefined){
				if(_.isFunction(attr['default'])){
					let v = attr['default'].call(me);
					me.set(name, v);
				}else{
					if(name == 'entrydate'){
						me.set(name, new Date());
					}else if(name == 'entryday'){
						me.set(name, parseInt(moment(new Date()).format('DD')));
					}else if(name == 'entrymonth'){
						me.set(name, parseInt(moment(new Date()).format('MM')));
					}else if(name == 'entryyear'){
						me.set(name, parseInt(moment(new Date()).format('YYYY')));
					}else if(name == 'entryhour'){
						me.set(name, parseInt(moment(new Date()).format('hh')));
					}else if(name == 'entryhour'){
						me.set(name, parseInt(moment(new Date()).format('mm')));
					}else if(name == 'starttime'){
						me.set(name, parseInt(moment(new Date()).format('x')));
					}else{
						me.set(name, attr.default);
					}
				}
			}
		});
    },
    get: function(propname){
		var me = this;
		if(!me.hasProperty(propname)){
			throw new Error("Property " + propname + " nor found in " + me.getClassName());
			return;
		}
		return me.values[propname];
	},
	setObject: function(obj){
		var me = this;
		_.each(obj, function(val, key){
			//console.log(key, val, me.getClassName());
			me.set(key, val);
		});
	},
	set: function(propname, val){
		var me = this;
		if(!me.hasProperty(propname)){
			console.trace("Property " + propname + " nor found in " + me.getClassName());
			//throw new Error("Property " + propname + " nor found in " + me.getClassName());
			return;
		}
		var prop = me.getProperty(propname);
		if(prop.rel != undefined && prop.rel==true){
			if(!_.isObject(val) || (_.isObject(val) && !_.has(val, 'isClass'))){
				var RelModel = require('./models/' + prop.entity);
				var relModel = new RelModel();
				if(_.isObject(val)){
					_.each(val, function(v, k){
						relModel.set(k, v);
					})
				}else{
					relModel.set(relModel.identifier, val);
				}
				val = relModel;
			}		
			if(val.getClassName() != prop.entity){
				console.trace("Property " + propname + " not is a  " + prop.entity + " object in " + me.getClassName() + ' model.');
				//throw new Error("Property " + propname + " not is a  " + prop.entity + " object in " + me.getClassName() + ' model.');
				return;
			}
			if(prop.type==1){
				if(!_.has(me.values, propname) || !_.isArray(me.values[propname])){
					me.values[propname]=[];
				}
				me.values[propname].push(val);
			}else{
				me.values[propname] = val;
			}
		}else{
			me.values[propname] = val;
		}
		return this;
    },
    getTablename: function(){
    	return this.table.toLowerCase();
    },
    getStrColumns: function(index){
    	var me = this;
    	var strCols = "";
		_.each(me.columns, function(colname, key){
			if(strCols!="") strCols+=', ';
			if(index)
				strCols+=index+'.'+colname;
			else
				strCols+=colname;
		});
		return strCols;
    },
    hasProperty: function(prop){
    	var me = this;
    	var found = false;
    	_.each(me.attributes, function(sett, name){
			//console.log(name, prop, name == prop)
    		if(name == prop) found = true;
    	});
    	return found;
    },
    getValues: function(){
    	var me = this;
    	var values = {};
    	_.each(me.attributes, function(prop, name){
    		var val = me.get(name);
    		if(val != undefined) values[me.getColnameFromProperty(name)] = val;
    		else{
    			if(prop['default']){
    				if(_.isFunction(prop['default'])){
    					let v = prop['default'].call(me);
    					me.set(name, v);
    				}else{
    					if(name == 'entrydate'){
    						me.set(name, new Date());
    					}else if(name == 'entryday'){
    						me.set(name, parseInt(moment(new Date()).format('DD')));
    					}else if(name == 'entrymonth'){
    						me.set(name, parseInt(moment(new Date()).format('MM')));
    					}else if(name == 'entryyear'){
    						me.set(name, parseInt(moment(new Date()).format('YYYY')));
    					}else{
    						me.set(name, prop.default);
    					}
    				}
    			}
    		}
    	});
    	if(!values[this.identifier]) values[this.identifier] = values[this.getColnameFromProperty(this.identifier)];
    	return values;
    },
    getProperties: function(){
    	var me = this;
    	var properties = {};
    	_.each(me.attributes, function(prop, name){
    		if(!prop.rel) properties[name] = prop;
    	});
    	return properties;
    },
    getProperty: function(propname){
    	var me = this;
    	return me.attributes[propname] || null;
    },
    getRelations: function(){
    	var me = this;
    	var relations = {};
    	_.each(me.attributes, function(prop, name){
    		if(prop.rel) relations[name] = prop;
    	});
    	return relations;
    },
    getAllAttributes: function(){
    	var me = this;
    	var attr = {};
    	_.each(me.attributes, function(prop, name){
    		attr[name] = prop;
    	});
    	return attr;
	},
	getRepositoryName: function(){
		return this.repository;
	},
	getColnameFromProperty: function(propname){
		var me = this;
		if(me.attributes[propname]) return me.attributes[propname].col;
		return null;
	},
});