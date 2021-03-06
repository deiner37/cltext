var Controller = require('../model/CRUDController');
var jwt = require('jwt-simple');
var moment = require('moment');
module.exports = Controller.extend({
	documentName: 'User',
	className: 'UserController',
	slug: 'admin/user',
	routes: {
		'checksession': {
			path: '/session',
			method: 'GET',
			auth: true,
			callback: 'checksession'
		}
	},
	initialize: function (app) {
		var me = this;
		me.app = app;
		me.securityManager = me.app.get("security_manager");
		me.app.get('document_manager').getDocumentByClassName(this.documentName).then(function (Document) {
			me.model = Document;
		});
	},
	checkLogin: function (req, res) {
		var me = this;
		var data = me.getRequestData(req);
		var username = data.username;
		var pass = data.password;
		if (!username || !pass) throw "User or Password can not be null.";
		me.securityManager.authenticate(username, pass).then(function (user) {
			delete user.password;
			var expires = moment().add(7, 'days').valueOf();
			let tokenObj = {
				iss: user.id,
				exp: expires
			}
			var token = jwt.encode(tokenObj, me.app.get('jwtTokenSecret'));
			//var token_decoded = jwt.decode(token, app.get('jwtTokenSecret'));
			req.session.user = user;
			req.session.token = token;
			req.session.save();

			let response = {
				token: token,
				expires: expires,
				user: user
			}
			res.status(201).json(response);

		}).catch(function (e) {
			console.error(e);
			res.status(400).json({
				'message': e.message
			})
		});
	},
	logout: function (req, res) {
		req.session.destroy(function () {
			res.status(200).json({
				msg: "ok"
			});
		});
	},
	checksession: function (req, res) {
		var me = this;
		var data = me.getRequestData(req);
		let token = req.params.token;
		res.status(200).json({
			success: true
		});
	},
	beforeSave: function(entity){
		let me = this;
		return new Promise(function(resolve, reject){
			me.app.get('document_manager').getRepository(me.documentName).then(function(repo){
				repo.findBy({
					'email': entity.get('email')
				}).then(rows => {
					if(rows && rows.length > 0){
						reject("Email already exists");
						return;
					}
					me.app.get('security_manager').encodePassword(entity.get('password')).then(function(passencoded){
						entity.set("password", passencoded);
						resolve(entity);
					}).catch(function(e){
						console.error(e)
					});
				});
				
			});
		});
		
	}
});