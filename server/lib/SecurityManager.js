var AbstractClass = require('../model/AbstractClass');
var _ = require('underscore');
var bcrypt = require('bcrypt-nodejs');
var UserNotFoundException = require('../exceptions/UserNotFound');

module.exports = AbstractClass.extend({
    app: null,
	initialize: function(app){
        var me = this;
        me.app = app;
	},
	authenticate: function(username, password){
		var me = this;
		return new Promise(function (resolve, reject) {
            me.app.get("document_manager").getRepository("User").then(function(repo){
                repo.findOneBy({
                    'username': username,
                    'deleted': false
                }).then(function(user){
                    if((user && !bcrypt.compareSync(password, user.password)) || !user){
                        reject(new UserNotFoundException('User not found'));
                        return;
                    }
                    resolve(user);
                }).catch(function(er){
                    reject(re);
                });
            });
		});
	},
});