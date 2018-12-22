var AbstractModel = require('../model/AbstractDocument');
var moment = require('moment');
module.exports = AbstractModel.extend({
	table: 'd_error', 
	className: 'Error',
	attributes: {
		'id':{
			'col': '_id',
			'pk': true
		},
		'deleted':{
			col: 'deleted',
			default: false
		},
		'error':{
			col: 'error',
			'default': {}
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