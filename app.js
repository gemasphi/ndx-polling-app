let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser')
let cors = require('cors')
let compression = require('compression')
let whileList = require('./whileListAddr.json')
let pollRouter = require('./routes/poll');
let devRouter = require('./routes/dev');
const {getClientDB} = require('./utils/db');
const {generalErrorMessage, generalErrorCode} = require('./utils/customExceptions');

const dev = (process.env.NODE_ENV !== 'production')

console.log(process.env.IPFS_PATH)
let db = Promise.resolve(getClientDB(process.env.IPFS_PATH))

// Set up Express
let app = express();

// Set up CORS policy 
if(dev===true){
  app.use(cors())
} else {
  console.log(whileList['addresses'])
  app.use(cors())

  /*
  let whitelistAddr = whileList['addresses'] 
  let corsOptions = {
    origin: function (origin, callback) {
      if (whitelistAddr.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }
  app.use(cors(corsOptions));
  */
}

// Compress response bodies for greater speed
app.use(compression())

// Serve front-end
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Pass relevant objects to routers
app.use((req, res, next) => {
  req.db = db
  req.dev = dev
  req.providerLink = process.env.WEB3_INFURA_PROJECT_ID
  next()
})

app.use('/api/poll', pollRouter);
if(dev===true){
  app.use('/dev', devRouter);
}

// Redirect anything else to the frontend
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send({'message': 'Unkown route'})
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = dev ? err : {};
  //if(req.dev===true){ console.log(err) }
  console.log(err)
  res.status(generalErrorCode).send({'message': generalErrorMessage})
});

module.exports = app;
