var AbstractModel = require('../model/AbstractDocument');
var moment = require('moment');
module.exports = AbstractModel.extend({
	table: 'd_user', 
	className: 'User',
	attributes: {
		'id':{
			'col': '_id',
			'pk': true
		},
		'deleted':{
			col: 'deleted',
			default: false
		},
		'firstname':{
			col: 'firstname',
		},
		'lastname':{
			col: 'lastname',
		},
		'city':{
			col: 'city',
			'default': ''
        },
		'state':{
			col: 'state',
			'default': ''
        },
		'address':{
			col: 'address',
			'default': ''
        },
		'province':{
			col: 'address',
			'default': ''
        },
		'zip':{
			col: 'zip',
        },
        'email':{
			col: 'email',
			'default': ''
        },
        'password':{
			col: 'password',
			'default': ''
		},
        'phonenumber':{
			col: 'phonenumber',
			'default': ''
		},
		'picture':{
			col: 'picture',
			'default': ''
        },
        'entrydate':{
			col: 'entrydate',
			'default': new Date()
		},
		'entryday':{
			col: 'entryday',
			'default': parseInt(moment(new Date()).format('DD'))
		},
		'entrymonth':{
			col: 'entrymonth',
			'default': parseInt(moment(new Date()).format('MM'))
		},
		'entryyear':{
			col: 'entryyear',
			'default': parseInt(moment(new Date()).format('YYYY'))
		}
	}
});