const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const fs = require('fs');
const solc = require('solc');
const input = fs.readFileSync('../Dapp/contracts/Copyright.sol');
const output = solc.compile(input.toString(), 1);
const bytecode = output.contracts[':Copyright'].bytecode;
const abi = JSON.parse(output.contracts[':Copyright'].interface);

//var privateKey = "98efb4a587c5e98939cdda06fbabcdcaee60bfbb615f69a7a69ee16b0b30986b";
//web3.eth.accounts.wallet.add("0x" + privateKey);

var contractInstance = new web3.eth.Contract(abi,"0x19ecA898c5EE9c824854f26Cb18bAfb6a023540D");
//var account = "0xFd4060dC3b64Ec310CaDc6d6A850B9b31281D4C3"; // on geth
var account = "0xFd4060dC3b64Ec310CaDc6d6A850B9b31281D4C3"; // on parity

contractInstance.methods.getOwner().call(function(error, result){
  console.log("Owner is: " + JSON.stringify(result));
  //console.log("Owner arr is: " + result[0] +"," + result[1]);
});

contractInstance.methods.addContract("one-one","two-two","three-three","four-four",55,66).send({from: account, gas: 500000},function(error, result){
  if (error)
    console.log("@addContract error is " + JSON.stringify(error));
  else
    console.log("@addContract response is " + JSON.stringify(result));
});
