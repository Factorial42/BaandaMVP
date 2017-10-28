'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var docSchema = new Schema({
  name: {
    type: String,
    required: 'Name of the Document'
  },
  body: {
    type: String,
    required: 'Body of the Document'
  },
  s3path: {
    type: String,
    required: 'Path in s3 for the document'
  },
  SHA256: {
    type: String,
    required: 'encrypted hash for the document'
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});
const Doc = mongoose.model('Doc', docSchema);
module.exports = Doc;
