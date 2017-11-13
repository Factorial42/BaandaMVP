// Allows us to use ES6 in our migrations and tests.
require('babel-register')

var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = "Yn6ooC1GML0YPlm4IDmg";
var mnemonic = "act apple quiz random oil bronze daring upon roast vote typical dizzy";

module.exports = {
  networks: {
    dev: {
      host: "localhost",
      port: 8545,
      gas: 3000000,
      network_id: "*" // Match any network id
    },
    ropsten: {
      gas: 3000000,
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey),
      network_id: 3
        }
  }
};

mocha: {
  timeout:  '999999999999999999999ms'
}
