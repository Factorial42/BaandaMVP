const request = require('request');
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
var opn = require('opn'); //for opening the URL

//var privateKey = "6d416eda211ff2dc413ad60cf8d643eeb472de5bb2b632356a1de1c499d98c49";


//redirect URL once contract address is createdTS
const redirectURL = "http://localhost:8080/?cId=";

// Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));


//web3.eth.accounts.wallet.add("0x" + privateKey);


// Compile the source code
const input = fs.readFileSync('../Dapp/contracts/Copyright.sol');
const output = solc.compile(input.toString(), 1);
//console.log("ByteCode:" + JSON.stringify(output.contracts[':Copyright'].bytecode,null,2));
//console.log("ABI:" + JSON.stringify(output.contracts[':Copyright'].abi,null,2));
const bytecode = output.contracts[':Copyright'].bytecode;
const abi = JSON.parse(output.contracts[':Copyright'].interface);

// Contract object
//const contract =  web3.eth.contract(abi); //works pre 1.0 of Web3
const contract = new web3.eth.Contract(abi);
//const account = "0xFd4060dC3b64Ec310CaDc6d6A850B9b31281D4C3" //on geth
const account = "0x00A0091db3062Da65950E8cDE7E5A694c8d2410E" //on parity
//console.log ( "contract@" + JSON.stringify(contract,2,null));
//const gasEstimate = web3.eth.estimateGas({data: bytecode});
//console.log("gasEstimate@"+ gasEstimate);

console.log("Deploying Copyright Contract ....");

contract.deploy({
    data: '0x' + bytecode,
    arguments: ["mpreddy77@somemailer.com"]
}).send({
  //from:"0x00a0091db3062da65950e8cde7e5a694c8d2410e",
  from:account,
    gas: 4000000,
    gasPrice: '80000000'
}, function (error, transactionHash) {

}).on('error', function (error) {
    console.log('error@', error);
}).on('transactionHash', function (transactionHash) {
    console.log('transactionHash@', transactionHash);
}).on('receipt', function (receipt) {
    console.log('receipt && contract address@', receipt.contractAddress);
    testContract(receipt.contractAddress);
    console.log("Redirecting to " + redirectURL + receipt.contractAddress);
    opn(redirectURL + receipt.contractAddress);
}).on('confirmation@', function (confirmationNumber, receipt) {
  //if needed show confirmations
  console.log('confirmation', confirmationNumber);
});

/*  //web3 deprecated way of deploying/instantiating contract
// Deploy contract instance
const contractInstance = contract.new("jit@jitty.com", {
    data: '0x' + bytecode,
    from: web3.eth.accounts[0],
    gas: 4600000
}, (err, res) => {
    if (err) {
        console.log("Error in instantiating Contract " + err);
        return;
    }

    // Log the tx, you can explore status with eth.getTransaction()
    console.log("Contract transactionHash is: " + res.transactionHash);


    // If we have an address property, the contract was deployed
    if (res.address) {
        console.log('Contract address is : ' + res.address);
        // Let's test the deployed contract
        testContract(res.address);
        console.log("Redirecting to " + redirectURL + res.address);
        opn(redirectURL + res.address);
        //process.exit();
    }
});
*/
// Quick test the contract
function testContract(address) {
  console.log ("in testContract@" + address);
  var _contract = new web3.eth.Contract(abi,address);
    _contract.methods.getOwner().call({from: web3.eth.accounts[0]}, function(error, owner){
      console.log("Owner is: " + owner);
      testPOSTapi(address, owner[0], owner[1]);
    });
}

function testPOSTapi(contractAddress, ownerAddress, ownerEmail) {
  console.log ("in testPOSTapi@" + ownerEmail);
    var postJson = {
        "contract_address": contractAddress,
        "contract_name": "SmartContract:Copyright",
        "contract_owner_address": ownerAddress,
        "contract_owner_email": ownerEmail,
        "contract_abi_artifacts": abi
    };

    var options = {
        url: 'http://localhost:3000/uploadContract',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        json: postJson
    };

    request(options, function(err, res, body) {
        if (err) console.log("testPOSTapi:" + err);
        if (res && (res.statusCode === 200 || res.statusCode === 201)) {
            console.log(body);
            //testContractFromDB(contractAddress);
        }
    });
}
