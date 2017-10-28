const Web3 = require('web3');

if (typeof web3 !== 'undefined') {
    web3 = new Web3();
} else {
    console.log(`Connecting to geth on RPC @http://localhost:8545` );
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider(`http://localhost:8545`));
}

//Basic Sync to Async test
//console.log("1: Before calling asyncToSync function - to illustrate sequence");
//console.log("2: asyncToSync function call resulted in " + asyncToSync);
//var unlockedStatus = unlockAccount("0xFd4060dC3b64Ec310CaDc6d6A850B9b31281D4C3","mpreddy77");
//console.log ("2: unlockedStatus : " + unlockedStatus);
//console.log("3: After calling asyncToSync function - to illustrate sequence");

function unlockAccount(account,password) {
    var sync = true;
    var data = null;
    console.log ("Unlocking account: " + account);

    web3.personal.unlockAccount(account, password, 60000, function (error, result) {
      //console.log ("error is:" + error);
      //console.log("result is:" + result);
      if (!error){
        data = result;
        sync = false;
        console.log ("Unlocked account: " + account);
      }
    });
    while(sync) {require('deasync').sleep(100);}
    return data;
}

var accounts = getAccounts();
for (var i=0;i<accounts.length;i++){
  console.log (" Unlocking account:" + i);
  var lockStatus = unlockAccount(accounts[i],"mpreddy77");
}


console.log ( "Accounts are:" + accounts);
function getAccounts() {
    var sync = true;
    var data = null;

    web3.eth.getAccounts(function (error, result) {
      //console.log ("error is:" + error);
      //console.log("result is:" + result);
      if (!error){
        data = result;
        sync = false;
      }
    });
    while(sync) {require('deasync').sleep(100);}
    return data;
}
