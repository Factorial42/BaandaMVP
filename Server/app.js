const fileUpload = require('express-fileupload');
var serveIndex = require('serve-index');
var cors = require('cors')
var opn = require('opn');

var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Docs = require('./api/models/docModel'),
    Contracts = require('./api/models/contractModel'),
    Users = require('./api/models/userModel'),
    bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/DocDB', {
    useMongoClient: true
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
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

//console.log(JSON.stringify(app._router.stack,null,2));
var routes = [];
var host = "http://localhost:3000";

app._router.stack.forEach(function(r) {
    if (r.route && r.route.path) {
        //console.log(r.route.path)
        routes.push("<a href = " + host + r.route.path + ">" + r.route.path + "</a>");
    }
})
//finally add the login route
routes.push("<a href = " + host + "/login" + "> login </a>");

app.get('/', function(req, res) {
    //res.sendFile(__dirname +'/index.html');
    var response = "<center><h2>Welcome to Baanda Micro Service server running @ port 3000<h2></center><br>"
    response += "Available routes are: " + JSON.stringify(routes);
    res.send(response);
});

app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/dapp/login.html');
});

opn('http://localhost:3000/login');

/*
app.use('/public', serveIndex('files')); // shows you the file list
app.use('/public', express.static('files')); // serve the actual files
*/

app.use(express.static('dapp'))


app.listen(port);

console.log('Baanda POC API server started on: ' + port);
