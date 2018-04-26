
var Copyright = artifacts.require("./Copyright.sol");

module.exports = function(deployer) {
  deployer.deploy(Copyright,"reddy@f42labs.com");
};
