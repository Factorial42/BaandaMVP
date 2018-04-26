const fileUpload = require('express-fileupload');
var cors = require('cors')

var express = require('express'),
    app = express(),
    port = process.env.PORT || 1234,
    bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(fileUpload());


app.post('/data', function (req, res) {
  console.log("@headers" + JSON.stringify(req.headers));
  console.log("@body" + JSON.stringify(req.body));
  console.log("@body userid:" + req.body.userid);
  console.log("@body filelabel:" + req.body.filelabel);
  console.log("@body file name" + req.files.file.name);
  console.log("@body file data" + req.files.file.data);
  console.log("@body file mime" + req.files.file.mimetype);
  res.end();
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/jitpost.html');
});
app.listen(1234);
