//var ConvertLib = artifacts.require("./ConvertLib.sol");
//var MetaCoin = artifacts.require("./MetaCoin.sol");
var Copyright = artifacts.require("./Copyright.sol");

module.exports = function(deployer) {
  /*
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  */
  deployer.deploy(Copyright,"reddy@f42labs.com");
};
