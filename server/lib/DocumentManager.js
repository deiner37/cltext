var AbstractModel = require('../model/AbstractClass');
var fs = require('fs');
var moment = require('moment');
const path = require('path');
module.exports = AbstractModel.extend({
    app: null,
    documentsPath: 'server/documents',
    initialize: function(app){
        this.app = app;
    },
    
    /**
     * 
     * @param {classname} class name 
     * return the class repository
     */
    getRepository: function(className){
        var me = this;
        return new Promise(function(resolve, reject){
            me.getClassFromClassName(className).then(function(Document){
                let document = new Document();
                var Repository = require('../repositories/' + document.getRepositoryName()); 
                var repo = new Repository(document, me.app);
                resolve(repo);
            }).catch(function(msg){
                console.error('getRepository: ', msg);
                reject(msg);
            });
        });
    },
    /**
     * Return class from classname
     */
    getClassFromClassName: function(className){
        var me = this;
        return new Promise(function(resolve, reject){
            let cpath = path.join(process.cwd(), me.documentsPath);
            let cfiles = [];
            fs.readdir(cpath, (err, files) => {
                let found = false;
                if(files && files.length > 0){
                    files.forEach(file => {
                        var Document = require(cpath + '/' + file);
                        try{
                            if(typeof Document == 'function'){
                                let document = new Document();
                                if(document.getClassName()==className){
                                    found=true;
                                    resolve(Document);
                                }
                            }
                        }catch(e){
                            console.error(e, file);
                        }
                    });
                }
                if(!found){
                    reject('Class "' + className + '" not found');
                }
                //resolve(cfiles);
            })
        });
    },
    getDocumentByClassName: function(classname){
        let me = this;
        return new Promise(function(resolve, reject){
            me.getClassFromClassName(classname).then(function(Document){
                resolve(Document);
            }).catch(function(msg){
                reject(msg);
            });
        });
    }
});