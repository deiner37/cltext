var AbstractModel = require('../model/AbstractDocument');
var moment = require('moment');
module.exports = AbstractModel.extend({
	table: 'd_invoice', 
	className: 'Invoice',
	attributes: {
		'id':{
			'col': '_id',
			'pk': true
		},
		'deleted':{
			col: 'deleted',
			default: false
		},
		'products':{
			col: 'products',
			default: []
		},
		'user':{
			col: 'user',
		},
		'total':{
			col: 'total',
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