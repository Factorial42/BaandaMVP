// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import {
    default as Web3
} from 'web3';
import {
    default as contract
} from 'truffle-contract'

if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
} else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

/*
 * When you compile and deploy your Copyright contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Copyright abstraction. We will use this abstraction
 * later to create an instance of the Copyright contract.
 */
//import copyright_artifacts from '../../build/contracts/Copyright.json' //- not needed since we load from mongo/db/api

//var Copyright = contract(copyright_artifacts);
//console.log ("Copyright contract is: " + JSON.stringify(copyright_artifacts.abi,null,2));
let ownerAdd;

//Get the Contract Address from the request parameter
const _theContractAddress = getUrlParameter('cId');
console.log("@contract_address:" + _theContractAddress);

//var account = "0xFd4060dC3b64Ec310CaDc6d6A850B9b31281D4C3"; // on geth
var account = "0x00A0091db3062Da65950E8cDE7E5A694c8d2410E"; //on parity

//check if valid contract Address else throw error
//if (! web3.utils.isAddress(_theContractAddress))
//  console.log("Contract Address is Not a valid Address");

var abi = getABI(_theContractAddress);
//console.log ("ABI@" + JSON.stringify(abi));

//const Copyright =  web3.eth.contract(abi).at(_theContractAddress);
var Copyright = new web3.eth.Contract(abi, _theContractAddress);

//test functions to access contract methods via the abi/address route
Copyright.methods.getOwner().call(function(error, result) {
    if (!error)
        console.log("@test-owner" + JSON.stringify(result, null, 2));
    else
        console.error("@test-owner" + error);
});

window.deleteCopyright = function(elem) {
    let docName = elem.id;
    console.log("Delete Copyright with name: *" + docName + "* with owner add: " + ownerAdd);
    try {
        $("#msg").html("Delete copyright has been submitted for *" + docName + " *. The table will refresh once the deletion is recorded on the blockchain. Please wait...").css({
            'color': 'green',
            'font-size': '110%'
        });

        Copyright.methods.deleteContract(ownerAdd, docName).send({
            gas: 500000,
            //from: web3.eth.accounts[0]
            from: account
        }).on('receipt', function(receipt) {
            console.log("@deleteContract" + receipt);
            $("#msg").html("Document *" + docName + "* has been successfully deleted from blockchain!");
            removeRecord(docName);
        });
    } catch (err) {
        console.log(err);
    }

    console.log("Deleting via /delete from M & S3")
    $.ajax({
        url: 'http://localhost:3000/delete/' + docName,
        type: 'GET',
        data: "", //new FormData( $("#uploadForm") ),
        processData: false,
        contentType: false,
        success: function(msg) {
            console.log("Delete returned: " + JSON.stringify(msg, null, 2));
        },
        error: function(e) {
            console.log("Delete errored in: " + e);
        }
    });
    //e.preventDefault();
}

window.addCopyright = function(docname) {
    let contractName = $("#docname").val();
    console.log("Contract name is " + contractName);
    try {
        $("#msg").html("Document has been submitted to the contract. The copyrighted document is displayed above once it is recorded on the blockchain. Please wait...").css({
            'color': 'green',
            'font-size': '110%'
        });
        $("#addCopyright").removeClass("btn btn-primary");
        $("#addCopyright").addClass("btn btn-primary disabled");

        /* Copyright.deployed() returns an instance of the contract. Every call
         * in Truffle returns a promise which is why we have used then()
         * everywhere we have a transaction call
         * todo use async-await in lieu of promise
         */
        var createdTS = Math.floor(new Date() / 1000);
        var updatedTS = Math.floor(new Date() / 1000);
        var _v = [$("#docname").val(), $("#doctype").val(), $("#docurl").val(), $("#docsha").val(), createdTS, updatedTS];
        //console.log("@_v:" + _v);
        /*
                Copyright.methods.addContract($("#docname").val(), $("#doctype").val(), $("#docurl").val(), $("#docsha").val(), createdTS, updatedTS).send({
                    gas: 500000,
                    //from: web3.eth.accounts[0]
                    from: account
                }, function(error, result) {
                  console.log ("@addContract.send():" + error + result);
                    Copyright.methods.getLastContract().call(function(error, v) {
                        console.log ( "@LastContract:" + JSON.stringify(v,null,2));
                        //populateTable(v);
                        populateTable((_v));
                        $("#msg").html("Document *" + contractName + "* has been successfully recorded onto blockchain!");
                        clearNewRecord();
                        $("#foo").val("");
                    });
                });
          */

        // using events
        Copyright.methods.addContract($("#docname").val(), $("#doctype").val(), $("#docurl").val(), $("#docsha").val(), createdTS, updatedTS).send({
            gas: 500000,
            from: account
        }).on('receipt', function(receipt) {
            console.log("@addContract.send():" + receipt);
            Copyright.methods.getLastContract().call(function(error, v) {
                console.log("@LastContract:" + JSON.stringify(v, null, 2));
                populateTable(v);
                //populateTable((_v));
                $("#msg").html("Document *" + contractName + "* has been successfully recorded onto blockchain!");
                clearNewRecord();
                $("#foo").val("");
            });
        });
    } catch (err) {
        console.log(err);
    }
}

$(document).ready(function() {
    //Copyright.setProvider(web3.currentProvider);
    // get the length of documents on the chain
    var contractCount = 0;

    Copyright.methods.getOwner().call(function(error, result) {
        //console.log("@Owner is: " + JSON.stringify(result));
        ownerAdd = result[0];
        populateOwner(result);
    });

    Copyright.methods.getContractCount().call(function(error, count) {
        contractCount = count;
        console.log("Record Count is " + count);

        for (var i = 0; i < contractCount; i++) {
            Copyright.methods.getContractByIndex(i).call(function(error, v) {
                populateTable(v);
                console.log(" Contract " + i + " is : " + JSON.stringify(v, null, 2));
            });
        }
    });
});

function populateTable(v) {
    var beginTag = "<tr id='doc_" + v[0] + "'><td>";
    var endTag = "</td></tr>";
    var midTag = "</td><td>";

    var view = "<a href='" + v[2] + "' class='btn btn-primary' target='_blank'>View</a>";
    var link = "<a href='#' id='" + v[0] + "' onclick='deleteCopyright(this);' class='btn btn-primary'>Delete</a>";
    var html = beginTag + v[0] + midTag + v[1] + midTag + v[2] + midTag + v[3].substring(0, 10) + "..." + midTag + new Date(v[4] * 1000).toISOString() + midTag + new Date(v[5] * 1000).toISOString() + midTag + link + midTag + view + endTag;
    $('#mytable tbody').append(html);
}

function populateOwner(v) {
    jQuery("label[for='docOwner']").html('This contract is owned by address*' + v[0] + '* and email *' + v[1] + '*');
}

function removeRecord(docName) {
    console.log("removing record with name: " + docName);
    //$('#doc_' + docName).remove();
    location.reload();
}


function clearNewRecord() {
    $("#docname").val("");
    $("#doctype").val("");
    $("#docurl").val("");
    $("#docsha").val("");
    $("#doccreatedts").val("");
    $("#docupdatedts").val("");
}

/*
$('#foo').on('change', function(e) { //use on if jQuery 1.7+
       console.log(this.files[0]); //use the console for debugging, F12 in Chrome, not alerts
   });
*/

$("#foo").on("change", function(e) {
    var file = $('input[type=file]')[0].files[0];

    console.log("Uploading: " + $('input[type=file]')[0].files[0].name + " @ " + $('input[type=file]')[0].files[0].size + "bytes of type " + $('input[type=file]')[0].files[0].type);
    $("#docname").val(file.name);
    $("#doctype").val(file.type);
    $("#doccreatedts").val(getTS());
    $("#docupdatedts").val(getTS());
    var formData = new FormData();
    formData.append('foo', $('input[type=file]')[0].files[0]);
    formData.append('contract_address', _theContractAddress);
    $.ajax({
        url: 'http://localhost:3000/upload',
        type: 'POST',
        data: formData, //new FormData( $("#uploadForm") ),
        processData: false,
        contentType: false,
        success: function(msg) {
            console.log("File Upload returned: " + JSON.stringify(msg, null, 2));
            if (msg != null) {
                $("#docurl").val(msg.s3path);
                $("#docsha").val(msg.SHA256);
                $("#addCopyright").removeClass("btn btn-primary disabled");
                $("#addCopyright").addClass("btn btn-primary");
            }
        },
        error: function(e) {
            console.log("File upload errored in: " + e);
        }
    });
    e.preventDefault();
});


/*
$("#foo").on("change", function() {
    var file = this.files[0];
    $("#docname").val(file.name);
    $("#doctype").val(file.type);
    $("#doccreatedts").val(getTS());
    $("#docupdatedts").val(getTS());
    console.log("Uploading: " + file.name + " @ " + file.size + "bytes of type " + file.type);
    //upload the file by calling nodejs API in lieu of direct integration and populate sha/url
    $.ajax({
        url: 'http://localhost:3000/upload',
        type: 'POST',
        method: 'POST',
        contentType: false,
        cache: false,
        contentType: 'multipart/form-data',
        //headers: new Headers({ 'Content-Type': 'multipart/form-data' }),
        data: new FormData($("#uploadForm")),
        processData: false,
        success: function() {
            console.log(data)
        },
        error: function(e) {
            console.log(e)
        }
    });
});
*/

function getTS() {
    return Math.floor(new Date() / 1000);
}

function getABI(_address) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/contracts/" + _address, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);
    //console.log ("getABI contract_address:" + response.contract_address);
    return response.contract_abi_artifacts;
    //console.log ("getABI response:" + JSON.stringify(response));
}


function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
//Enable for Stripe Integration
/*
//String functionality goes here// Create a Stripe client
var stripe = Stripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');

// Create an instance of Elements
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: '#32325d',
    lineHeight: '24px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

// Create an instance of the card Element
var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server
      stripeTokenHandler(result.token);
    }
  });
});
*/
