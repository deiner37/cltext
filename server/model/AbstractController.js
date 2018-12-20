var AbstractClass = require('./AbstractClass');
var express = require('express');
var _ = require('underscore');
var path = require('path');
module.exports = AbstractClass.extend({
	routes: {},
	slug: null,
	app: null,
	className: 'AbstractController',
	initialize: function(app){
		let me = this;
		me.app = app;
	},
	generateRoutes: function(router){
		var me = this;
		var myroutes=me.get('routes');
		if(myroutes){
			var setRoutes = function(entity, routes, router){
				_.each(routes, function(route){
					let fullpath = (me.slug ? '/' + me.slug : '') + route.path;
					if(route.auth){
						//console.log(route.method.toUpperCase(), fullpath);
						router[route.method.toLowerCase()](fullpath, function(req, res, next){
							me.auth.call(me, req, res, next);
						}, function(req, res) {
							if(route.callback){
								if(_.isFunction(route.callback))
									route.callback.call(me,req,res);
								else if(_.isString(route.callback) && _.isFunction(me[route.callback]))
									me[route.callback].call(me,req, res);
							}
						});
					}else{
						router[route.method.toLowerCase()](fullpath, function(req, res) {
							if(route.callback){
								if(_.isFunction(route.callback))
									route.callback.call(me,req,res);
								else if(_.isString(route.callback) && _.isFunction(me[route.callback]))
									me[route.callback].call(me,req, res);
							}
						});
					}
				});
				if(entity.__super && entity.__super.get('routes') && _.keys(entity.__super.get('routes')).length > 0){
					setRoutes(entity.__super, entity.__super.get('routes'), router);
				}
			}
			setRoutes(me, myroutes, router);
			return router;
		}
		return null;
	},
	auth: function(req, res, next){
        return next();
		/*if (req.session && req.session.user){
			//save user action log
			if(req.method.toLowerCase() != 'get'){
				//check perimission
				var ModelManager = require('../models/ModelManager');
				let modelManager =  new ModelManager();
				var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
				
				let UserActionDocument = require("../documents/UserAction");
				let userAction = new UserActionDocument();
				userAction.set('user', req.session.user);
				userAction.set('ip', ip);
				userAction.set('usertype', req.session.type);
				userAction.set('method', req.method.toUpperCase());
				userAction.set('url', req.url);
				userAction.set('baseUrl', req.baseUrl);
				userAction.set('originalUrl', req.originalUrl);
				userAction.set('query', req.query);
				userAction.set('route', req.route);
				userAction.set('controller',process.mainModule.filename);
				userAction.save();
			}

			var headers = req.headers;
			//console.log()
			//res.locals.session = req.session;
		    return next();
		}else
			return res.sendStatus(401);*/
	},
	getRequestData: function(req){
		return _.extend(req.body, req.query);
	}
});