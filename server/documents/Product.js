var AbstractModel = require('../model/AbstractDocument');
var moment = require('moment');
module.exports = AbstractModel.extend({
	table: 'd_product', 
	className: 'Product',
	attributes: {
		'id':{
			'col': '_id',
			'pk': true
		},
		'name':{
			col: 'name',
			'default': ''
        },
        'description':{
			col: 'name',
			'default': ''
        },
        'value':{
			col: 'name',
			'default': 0
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