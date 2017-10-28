const fileUpload = require('express-fileupload');
var serveIndex = require('serve-index');
var cors = require('cors')

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Docs = require('./api/models/docModel'), //created model loading here
  bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/DocDB');

app.use(cors());
//app.use(bodyParser.json({ extended: false, limit: '5mb' }));
//app.use(bodyParser.urlencoded({limit: '5mb'}));

//app.use(bodyParser.json());
/*
app.use(bodyParser.urlencoded({
        extended: false,
     parameterLimit: 10000,
     limit: 1024 * 1024 * 10
}));
app.use(bodyParser.json({
        extended: false,
     parameterLimit: 10000,
     limit: 1024 * 1024 * 10
}));
*/
//app.use(bodyParser.json({limit: '50mb', parameterLimit: 1000000}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
app.use(fileUpload());

var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route


app.get('/', function(req, res){
  res.sendFile(__dirname +'/index.html');
});

app.get('/dapp', function(req, res){
  res.sendFile(__dirname +'/app/index.html');
});


/*
app.use('/public', serveIndex('files')); // shows you the file list
app.use('/public', express.static('files')); // serve the actual files
*/

app.listen(port);

console.log('Baanda POC API server started on: ' + port);
