var AWS = require('aws-sdk');
var fs = require('fs');
var mongoose = require('mongoose');
//Doc = mongoose.model('Doc');

AWS.config.loadFromPath('./config.json');
s3 = new AWS.S3({apiVersion: '2017-09-08'});


//test util functions
//listBuckets();

/*
_doc = new Doc;
_doc.name="test.json";
_doc.body="1234234";
uploadDataStream(_doc);
*/

/*
_doc = new Doc;
_doc.name="Buzz";
_doc.body="1234234";
deleteObject(_doc);
*/

//console.log ("UUID=" + generateUUID());
//console.log ( "SHA256=" + encryptSHA256("235dfsaddfsadfd"));


//Actual functions exported
function deleteObject(docId,callback){
  var deleteParams = {Bucket: 'baanda', Key: docId};
  s3.deleteObject (deleteParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } if (data) {
      console.log("Delete Success", data);
      return callback(data);
    }
  });
}


function encryptSHA256(_doc){
  var SHA256 = require("crypto-js/sha256");
  return SHA256(_doc.body);
  //console.log(SHA256(_doc));
}


function uploadDataStream(doc,callback){
  //var uploadParams = {Bucket: 'baanda', Key: generateUUID(), Body: doc.body};
  var uploadParams = {Bucket: 'baanda', Key: doc.name, Body: doc.body};
  // call S3 to retrieve upload file to specified bucket
  s3.upload (uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } if (data) {
      console.log("Upload Success", data.Location);
      return callback(data);
    }
  });
}

function listBuckets(){
  // Call S3 to list current buckets
  s3.listBuckets(function(err, data) {
     if (err) {
        console.log("Error", err);
     } else {
        console.log("Bucket List", data.Buckets);
     }
  });
}


function printDoc(_doc){
  console.log ( _doc.name + ":" + _doc.created_date);
}

function generateUUID() {
     var d = new Date().getTime();
     var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
         var r = (d + Math.random()*16)%16 | 0;
         d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
     });
     return uuid; };
module.exports.listBuckets = listBuckets;
module.exports.upload = uploadDataStream;
module.exports.delete = deleteObject;
module.exports.encryptSHA256 = encryptSHA256;
module.exports.print = printDoc;
