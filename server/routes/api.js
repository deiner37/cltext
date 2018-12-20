const express = require('express');
const path = require('path');
const _ = require('underscore');

const fs = require('fs');
var AbstractClass = require('../model/AbstractClass');

module.exports = AbstractClass.extend({
  router: null,
  app: null,
  customRoutesPath: './routes.js',
  controllerFolder: 'server/controller',
	initialize: function(router, app){
    var me = this;
    me.router = router;
    me.app = app;
  },
  readControllerFiles: function(){
    let me = this;
    return new Promise(function(resolve, reject){
      let cpath = path.join(process.cwd(), me.controllerFolder);
      let cfiles = [];
      fs.readdir(cpath, (err, files) => {
        if(files && files.length > 0){
          files.forEach(file => {
            cfiles.push(file);
          });
        }
        resolve(cfiles);
      })
    });
  },
  //Public Method
  proccessControllers: function(){
    let me = this;
    return new Promise(function(resolve, reject){
      me.readControllerFiles().then(function(routes){
        var slugRoot = '';
        for (const key in routes) {
          if (routes.hasOwnProperty(key)) {
            const controllerName = routes[key];
            let controllerPath = path.join(process.cwd(), me.controllerFolder, controllerName);
            try{
              if (fs.existsSync(controllerPath)) {
                var Controller = require(controllerPath);
                var newcontroller = new Controller(me.app);
                if(_.isFunction(newcontroller.generateRoutes)){
                  newcontroller.slug = slugRoot + newcontroller.slug;
                  newcontroller.generateRoutes(me.router);
                }
              }else{
                console.warn("Controller '" + controllerPath + "' was not found");
              }
            }catch(e){
              console.error(e); 
            }
          }
        }
        resolve();
      });
    });
  },
  //Public Method
  proccessCustomRoutes: function(){
    let me = this;
    return new Promise(function(resolve, reject){
      var otherRoutes = require(me.customRoutesPath);
      if(otherRoutes){
        for (const key in otherRoutes) {
          if (otherRoutes.hasOwnProperty(key)) {
            const route = otherRoutes[key];
            let controllerPath = path.join(process.cwd(), me.controllerFolder, route.controller + '.js');
            if (fs.existsSync(controllerPath)) {
              if(route.auth){
                if(_.isArray(route.method)){
                  _.each(route.method, function(mname){
                    me.router[mname.toLowerCase()](route.path, function(req, res) {
                      if(route.callback){
                        let Controller = require(controllerPath);
                        let newcontroller = new Controller(me.app);
                        if(_.isFunction(route.callback))
                          route.callback.call(newcontroller,req,res);
                        else if(_.isString(route.callback) && _.isFunction(newcontroller[route.callback])){
                          newcontroller[route.callback].call(newcontroller,req, res);
                        }
                      }
                    });
                  });
                }else{
                  me.router[route.method.toLowerCase()](route.path, newcontroller.auth, function(req, res) {
                    if(route.callback){
                      let Controller = require(controllerPath);
                      let newcontroller = new Controller(me.app);
                      if(_.isFunction(route.callback))
                        route.callback.call(newcontroller,req,res);
                      else if(_.isString(route.callback) && _.isFunction(newcontroller[route.callback]))
                        newcontroller[route.callback].call(newcontroller, req, res);
                    }
                  });
                }
              }else{
                if(_.isArray(route.method)){
                  for (const rm in route.method) {
                    if (route.method.hasOwnProperty(rm)) {
                      const mname = route.method[rm];
                      me.router[mname.toLowerCase()](route.path, function(req, res) {
                        if(route.callback){
                          let Controller = require(controllerPath);
                          let newcontroller = new Controller(me.app);
                          if(_.isFunction(route.callback))
                            route.callback.call(newcontroller,req,res);
                          else if(_.isString(route.callback) && _.isFunction(newcontroller[route.callback]))
                            newcontroller[route.callback].call(newcontroller,req, res);
                        }
                      });
                    }
                  };
                }else{
                  me.router[route.method.toLowerCase()](route.path, function(req, res) {
                    if(route.callback){
                      let Controller = require(controllerPath);
                      let newcontroller = new Controller(me.app);
                      if(_.isFunction(route.callback))
                        route.callback.call(newcontroller,req,res);
                      else if(_.isString(route.callback) && _.isFunction(newcontroller[route.callback]))
                        newcontroller[route.callback].call(newcontroller,req, res);
                    }
                  });
                }
              }
            }else{
              console.warn("Controller '" + controllerPath + "' was not found");
            }
          }
        }
      }
      resolve();
    });
  },
  getRouter: function(){
    return this.router;
  }
});