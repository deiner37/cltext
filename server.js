// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
var cors = require('cors')


// Get our API routes
const api = require('./server/routes/api');

//Get our server config
const config = require('./server/config/config');

app = express();
app.set('settings', config);


// CORS
app.use(cors({
    origin: function (origin, callback) {
        if(origin !== undefined){
            if (origin.substr(0, 7) == "::ffff:") {
            origin = origin.substr(7)
            }
            if (config.whiteList.indexOf(origin) !== -1) {
            callback(null, true)
            } else {
            console.error(origin + ' is not allowed in CORS');
            callback(new Error('Not allowed by CORS on host: ' + origin), false)
            }
        }else{
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
app.use(function(err, req, res, next){
  console.log("ERROR");
  console.error(err.stack);
  res.json({ msg: err })
});

//Get Error Entity
var ErrorDocument = require('./server/documents/Errors');

// Rewrite console.trace function
console.trace=(function() {
    var orig=console.trace;
    return function() {
      try{
        let docerror = new ErrorDocument();
        docerror.set('error', arguments);
        docerror.save().then(function(e){
  
        }).catch(function(e){
          console.log('Server.js - Line 86: ', e);
        });
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
        docerror.save().then(function(e){
  
        }).catch(function(e){
          console.log('Server.js - Line 105: ', e);
        });
      }catch(e){
        console.log('Server.js - Line 108: ', e);
      }finally{
        orig.apply(console, arguments);
      }
      orig.apply(console, arguments);
    };
})();

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);
// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

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
  if(lasterr && lasterr.stack == err.stack) return;
    lasterr = err;
  try{
    console.trace(err);
    //send email
  }catch(e){
    console.log(e);
  }
});
