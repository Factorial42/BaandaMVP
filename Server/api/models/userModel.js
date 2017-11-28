'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
  name: {
    type: String,
    required: 'Name of the User'
  },
  email: {
    type: String,
    required: 'email of the user'
  },
  password: {
    type: String,
    required: 'pass of the user'
  },
  mobile: {
    type: String,
    required: 'contact number of the user'
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});
const User = mongoose.model('User', userSchema);
module.exports = User;
