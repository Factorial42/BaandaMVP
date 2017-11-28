const request = require('request');
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');


// Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var abi = null;
var bytecode = null;
function deployContract(contractType, email, callback) {
    // Compile the source code
    const input = fs.readFileSync('../Dapp/contracts/Copyright.sol');
    const output = solc.compile(input.toString(), 1);
    //console.log("ByteCode:" + JSON.stringify(output.contracts[':Copyright'].bytecode,null,2));
    //console.log("ABI:" + JSON.stringify(output.contracts[':Copyright'].abi,null,2));
    bytecode = output.contracts[':Copyright'].bytecode;
    abi = JSON.parse(output.contracts[':Copyright'].interface);

    const contract = new web3.eth.Contract(abi);
    const account = "0x00A0091db3062Da65950E8cDE7E5A694c8d2410E" //on parity

    console.log("Deploying Copyright Contract ....");

    contract.deploy({
        data: '0x' + bytecode,
        arguments: [email]
    }).send({
        //from:"0x00a0091db3062da65950e8cde7e5a694c8d2410e",
        from: account,
        gas: 4000000,
        gasPrice: '80000000'
    }, function(error, transactionHash) {

    }).on('error', function(error) {
        console.log('error@', error);
        return callback(error);
    }).on('transactionHash', function(transactionHash) {
        console.log('transactionHash@', transactionHash);
    }).on('receipt', function(receipt) {
        console.log('receipt && contract address@', receipt.contractAddress);
        testContract(receipt.contractAddress,function(_data){
          return callback(_data);
        });
    }).on('confirmation@', function(confirmationNumber, receipt) {
        console.log('@confirmation', confirmationNumber);
    });
}
    // Quick test the contract
    function testContract(address,callback) {
        console.log("in testContract@" + address);
        var _contract = new web3.eth.Contract(abi, address);
        _contract.methods.getOwner().call({
            from: web3.eth.accounts[0]
        }, function(error, owner) {
            console.log("@testContract:Owner is: " + owner);
            testPOSTapi(address, owner[0], owner[1],function(data){
              return callback(data);
            });
        });
    }

    function testPOSTapi(contractAddress, ownerAddress, ownerEmail,callback) {
        console.log("in testPOSTapi@" + ownerEmail);
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
                //console.log(body);
                return callback(body);
            }
        });
    }
    module.exports.deployContract = deployContract;
