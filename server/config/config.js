module.exports = {
    //'env': 'production',
    'env': 'development',
    port: 3100,
    database: {
        mongo:{
            ip: 'localhost',
            port: '27017',
            database: 'cltext',
            user: null,
            pass: null,
            auth: false
        }
    },
    domain: 'localhost',
    whiteList:[
       'http://localhost', 
       'http://localhost:3100', 
       'http://localhost:4200'
    ]
}