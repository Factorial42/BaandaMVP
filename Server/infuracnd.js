var fs = require('fs');
var contract_data = JSON.parse(fs.readFileSync('../Dapp/build/contracts/Copyright.json'));

var openKey = "0x00A0091db3062Da65950E8cDE7E5A694c8d2410E";
var privateKey = "6d416eda211ff2dc413ad60cf8d643eeb472de5bb2b632356a1de1c499d98c49";

var Web3 = require('web3');
//var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/Yn6ooC1GML0YPlm4IDmg"));
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

web3.eth.accounts.wallet.add("0x" + privateKey);
/*web3.eth.accounts.wallet.add({
    privateKey: '0x6d416eda211ff2dc413ad60cf8d643eeb472de5bb2b632356a1de1c499d98c49',
    address: '0x00A0091db3062Da65950E8cDE7E5A694c8d2410E'
});*/

var contract = new web3.eth.Contract(contract_data.abi);

contract.deploy({
    data: contract_data.unlinked_binary,
    arguments: ["mpreddy77@somemailer.com"]
}).send({
    from: openKey,
    gas: 4700036,
    gasPrice: 80000000
}, function (error, transactionHash) {

}).on('error', function (error) {
    console.log('error@', error);
}).on('transactionHash', function (transactionHash) {
    console.log('transactionHash@', transactionHash);
}).on('receipt', function (receipt) {
    console.log('receipt && contract address@', receipt.contractAddress);
}).on('confirmation@', function (confirmationNumber, receipt) {
  //if needed show confirmations
  //console.log('confirmation', confirmationNumber);
});
