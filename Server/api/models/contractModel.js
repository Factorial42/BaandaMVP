'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contractSchema = new Schema({
  contract_address: {
    type: String,
    required: 'Address of the Contract'
  },
  contract_name: {
    type: String,
    required: 'Name of the Contract'
  },
  contract_owner_address: {
    type: String,
    required: 'Contract Owners Address'
  },
  contract_owner_email: {
    type: String,
    required: 'Contract Owners Email'
  },
  contract_abi_artifacts: {
    type: Object,
    required: 'Contract ABI artifacts'
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});
const Contract = mongoose.model('Contract', contractSchema);
module.exports = Contract;
