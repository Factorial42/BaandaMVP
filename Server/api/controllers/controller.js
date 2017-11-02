'use strict';
const UTIL = require('../utils/util.js');
var objectID = require('mongodb').ObjectID;
var mongoose = require('mongoose'),
    Doc = mongoose.model('Doc');

exports.list_all_docs = function(req, res) {
    Doc.find({}, function(err, doc) {
        if (err)
            res.send(err);

        var arr = [];
        for (var i = 0; i < doc.length; i++) {
            var myObj = new Object();
            myObj.id = doc[i]._id;
            myObj.name = doc[i].name;
            myObj.s3path = doc[i].s3path;
            myObj.created_date = doc[i].created_date;
            arr.push(myObj);
        }
        res.json(arr);
    });
};

//delete a doc by name or id
exports.remove_a_doc = function (req,res){
  var docId = req.params.docId;

  var type;
  if (objectID.isValid(docId)){
    type="_id";
    docId = require('mongodb').ObjectID(docId);
    console.log ("OBJECTID is valid " + docId);
  }
  else
    type="name";

  Doc.remove({type:docId}, function(err, doc) {
      if (err)
          res.send(err);
      res.json({
          message: 'Doc successfully deleted with ID/Name *' + req.params.docId
      });
  });
}

exports.upload_a_doc = function(req, res) {
    if (!req.files)
        return res.status(400).send('Duh!! No files were uploaded.');
    console.log("Req body is: " + req.body)
    console.log("Req file is: " + req.files)

    let testFile = req.files.foo;

    console.log("#NAME=" + req.files.foo.name);
    console.log("#MIME=" + req.files.foo.mimetype);
    console.log("#DATA=" + req.files.foo.data);


    //persist the doc
    var _doc = new Doc();
    _doc.name = req.files.foo.name;
    _doc.body = req.files.foo.data;


    //save doc to S3
    UTIL.upload(_doc, function(data) {
        if (data)
            console.log("Saving Doc:--" + _doc.name + " --:to S3@" + JSON.stringify(data, null, 4));
        console.log('File uploaded successfully!');

        //set the encrypted hash of the doc
        _doc.SHA256 = UTIL.encryptSHA256(_doc);
        //set the s3path n persist to mongo
        _doc.s3path = data.Location;

        res.send(_doc);
        console.log(_doc.name + " Successfully uploaded to both mongo and S3 @ \n " + JSON.stringify(data, null, 2) + " with SHA256 hash=" + _doc.SHA256);

        //Save doc to Mongo
        _doc.save(function(err, _doc) {
            if (err) {
                res.send(err);
                console.log("ERROR ::" + err);
                //res.send(_doc);
            }

            //do other custom processing
            UTIL.print(_doc);
        });
    });
}

exports.create_a_doc = function(req, res) {
    var new_doc = new Doc(req.body);
    console.log("Body is" + new_doc);
    new_doc.save(function(err, doc) {
        if (err)
            res.send(err);
        res.json(doc);
    });
};


exports.read_a_doc = function(req, res) {
    Doc.findById(req.params.docId, function(err, doc) {
        if (err)
            res.send(err);
        res.json(doc);
    });
};


exports.update_a_doc = function(req, res) {
    Doc.findOneAndUpdate({
        _id: req.params.docId
    }, req.body, {
        new: true
    }, function(err, doc) {
        if (err)
            res.send(err);
        res.json(doc);
    });
};


exports.delete_a_doc = function(req, res) {
    Doc.remove({
        _id: req.params.docId
    }, function(err, doc) {
        if (err)
            res.send(err);
        res.json({
            message: 'Doc successfully deleted'
        });
    });
};
