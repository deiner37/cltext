// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const formData = require("express-form-data");
const MongoStore = require('connect-mongo')(session);
var helmet = require('helmet');




//Get our server config
const config = require('./server/config/config');
process.env.NODE_ENV = config.env;

//Get document Manager
var DocumentManager = require('./server/lib/DocumentManager');

//Get Security Manager
var SecurityManager = require('./server/lib/SecurityManager');

app = express();
app.set('settings', config);
app.set('document_manager', new DocumentManager(app));
app.set('security_manager', new SecurityManager(app));
app.use(helmet());

// Get our API routes
let ApiClass = require('./server/routes/api');
const api = new ApiClass(express.Router(), app);

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

//proccess Controller routes
api.proccessControllers().then(function(){
  //proccess custom routes
  api.proccessCustomRoutes().then(function(){
    // Set our api routes
    app.use('/api', api.getRouter());

    // Catch all other routes and return the index file
    app.get('*', (req, res) => {
      console.log("ENTRO");
      console.log(path.join(__dirname, 'dist/index.html'));
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
  });
});





/*
// clear from the request and delete all empty files (size == 0)
app.use(formData.format());
// change file objects to stream.Readable 
app.use(formData.stream());
// union body and files
app.use(formData.union());

// parse data with connect-multiparty. 
app.use(formData.parse({
  uploadDir: '/tmp',
  autoClean: true
}));
*/

// CORS
app.use(cors({
  origin: function (origin, callback) {
    if (origin !== undefined) {
      if (origin.substr(0, 7) == "::ffff:") {
        origin = origin.substr(7)
      }
      if (config.whiteList.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        console.error(origin + ' is not allowed in CORS');
        callback(new Error('Not allowed by CORS on host: ' + origin), false)
      }
    } else {
      callback(null, true)
    }
  },
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowefHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With'],
  credentials: true
}));


// Parsers for POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//LOG ERRORS
app.use(function (err, req, res, next) {
  console.log("ERROR");
  console.error(err.stack);
  res.json({ msg: err })
});

//Get Error Entity
var ErrorDocument = require('./server/documents/Error');

/*
// Rewrite console.trace function
console.trace=(function() {
    var orig=console.trace;
    return function() {
      try{
        let docerror = new ErrorDocument();
        docerror.set('error', arguments);
        let dm = app.get('document_manager');
        let errRepo = dm.getRepository("Error");
        errRepo.save(docerror);
      }catch(e){
        console.log('Server.js - Line 89: ', e);
      }finally{
        orig.apply(console, arguments);
      }
    };
})();

// Rewrite console.trace function
console.error=(function() {
    var orig=console.error;
    return function() {
      try{
        let docerror = new ErrorDocument();
        docerror.set('error', arguments);
        let dm = app.get('document_manager');
        let errRepo = dm.getRepository("Error");
        errRepo.save(docerror);

      }catch(e){
        console.log('Server.js - Line 108: ', e);
      }finally{
        orig.apply(console, arguments);
      }
      orig.apply(console, arguments);
    };
})();*/



/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || app.get('settings').port || '81';
app.set('port', normalizePort(port));


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}


/**
 * Create HTTP server.
 */
const server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);

server.listen(port, () => console.log(`API running on localhost:${port}`));
lasterr = null;
process.on('uncaughtException', function (err) {
  if (lasterr && lasterr.stack == err.stack) return;
  lasterr = err;
  try {
    console.trace(err);
  } catch (e) {
    console.log(e);
  }
});

// Session management
if (!app.get('settings').database.mongo.auth) {
  var mongourl = 'mongodb://' + app.get('settings').database.mongo.ip + ':' + app.get('settings').database.mongo.port + '/' + app.get('settings').database.mongo.database;
} else {
  var mongourl = 'mongodb://' + app.get('settings').database.mongo.user + ':' + app.get('settings').database.mongo.pass + '@' + app.get('settings').database.mongo.ip + ':' + app.get('settings').database.mongo.port + '/' + app.get('settings').database.mongo.database;
}

app.set('trust proxy', 1)
app.set('jwtTokenSecret', 'cltext-1.0');
var expiryDate = new Date(Date.now() + 60 * 60 * 1000);  // 1 hour

app.use(session({
  secret: 'clt3st1.0&%ñ',
  resave: true,
  saveUninitialized: true,
  cookie: {
    // domain: 'ctivr.customercircle.com',
    // secure: true,
    httpOnly: false,
    maxAge: 24 * 360000 // 24 hours
  },
  store: new MongoStore({ url: mongourl, autoRemove: 'disabled' }),
}));
