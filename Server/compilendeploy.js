const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

// Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// Compile the source code
const input = fs.readFileSync('../Dapp/contracts/Copyright.sol');
const output = solc.compile(input.toString(), 1);
//console.log("ByteCode:" + JSON.stringify(output.contracts[':Copyright'].bytecode,null,2));
//console.log("ABI:" + JSON.stringify(output.contracts[':Copyright'].abi,null,2));
const bytecode = output.contracts[':Copyright'].bytecode;
const abi = JSON.parse(output.contracts[':Copyright'].interface);

// Contract object
const contract = web3.eth.contract(abi);

console.log ("Deploying Contract ....");

// Deploy contract instance
const contractInstance = contract.new("test@test.com",{
    data: '0x' + bytecode,
    from: web3.eth.accounts[0],
    gas: 4600000
}, (err, res) => {
    if (err) {
        console.log("Error in instantiating Contract " + err);
        return;
    }

    // Log the tx, you can explore status with eth.getTransaction()
    console.log ("Contract transactionHash is: " + res.transactionHash);


    // If we have an address property, the contract was deployed
    if (res.address) {
        console.log('Contract address is : ' + res.address);
        // Let's test the deployed contract
        testContract(res.address);
    }
});

// Quick test the contract

function testContract(address) {
    // Reference to the deployed contract
    const _contract = contract.at(address);
    var owner = _contract.getOwner.call();
    console.log("OWNER is: " + owner);
    // Destination account for test
    /*
    const dest_account = '0x002D61B362ead60A632c0e6B43fCff4A7a259285';

    // Assert initial account balance, should be 100000
    const balance1 = token.balances.call(web3.eth.coinbase);
    console.log(balance1 == 1000000);

    // Call the transfer function
    token.transfer(dest_account, 100, {from: web3.eth.coinbase}, (err, res) => {
        // Log transaction, in case you want to explore
        console.log('tx: ' + res);
        // Assert destination account balance, should be 100
        const balance2 = token.balances.call(dest_account);
        console.log(balance2 == 100);
    });
    */
}
