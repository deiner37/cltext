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
		'deleted':{
			col: 'deleted',
			default: false
		},
		'name':{
			col: 'name',
			'default': ''
        },
        'description':{
			col: 'description',
			'default': ''
		},
		'category_id':{
			col: 'category_id',
        },
        'value':{
			col: 'value',
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