// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import {
    default as Web3
} from 'web3';
import {
    default as contract
} from 'truffle-contract'


/*
 * When you compile and deploy your Copyright contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Copyright abstraction. We will use this abstraction
 * later to create an instance of the Copyright contract.
 */
import copyright_artifacts from '../../build/contracts/Copyright.json'

var Copyright = contract(copyright_artifacts);

//setup test records

window.deleteAllCopyrights = function(_theAddress) {
    let ownerAdd = $("#ownerAddress").val();
    console.log("Owner address is:" + ownerAdd);
    try {
        $("#msg").html("Delete all copyrights has been submitted. The table will refresh once the deletion is recorded on the blockchain. Please wait...")
        $("#docName").val("");

        Copyright.deployed().then(function(contractInstance) {
            contractInstance.deleteAllContracts(ownerAdd);
        });
    } catch (err) {
        console.log(err);
    }
}

window.addCopyright = function(docname) {
    let contractName = $("#docname").val();
    console.log("Contract name is " + contractName);
    try {
        $("#msg").html("Document has been submitted to the contract. The copyrighted document is displayed above once it is recorded on the blockchain. Please wait...").css({
            'color': 'green',
            'font-size': '110%'
        });

        /* Copyright.deployed() returns an instance of the contract. Every call
         * in Truffle returns a promise which is why we have used then()
         * everywhere we have a transaction call
         * todo use async-await in lieu of promise
         */
        Copyright.deployed().then(function(contractInstance) {
            var createdTS = Math.floor(new Date() / 1000);
            var updatedTS = Math.floor(new Date() / 1000);
            contractInstance.addContract($("#docname").val(), $("#doctype").val(), $("#docurl").val(), $("#docsha").val(), createdTS, updatedTS, {
                gas: 500000,
                from: web3.eth.accounts[0]
            }).then(function() {
                return contractInstance.getLastContract().then(function(v) {
                    populateTable(v);
                    $("#msg").html("Document *" + v[0] + "* has been successfully recorded onto blockchain!");
                    clearNewRecord();
                });
            });
        });
    } catch (err) {
        console.log(err);
    }
}

$(document).ready(function() {
    if (typeof web3 !== 'undefined') {
        console.warn("Using web3 detected from external source like Metamask")
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    Copyright.setProvider(web3.currentProvider);
    // get the length of documents on the chain
    var contractCount = 0;

    Copyright.deployed().then(function(contractInstance) {
        contractInstance.getContractCount().then(function(count) {
            contractCount = count.toNumber();
            console.log("Record Count is " + contractCount);
            for (var i = 0; i < contractCount; i++) {
                contractInstance.getContractByIndex(i).then(function(v) {
                    populateTable(v);
                    //console.log(" Contract " + i + " is : " + JSON.stringify(v, null, 2));
                });
            }
        })
    });
});

function populateTable(v) {
    var beginTag = "<tr><td>";
    var endTag = "</td></tr>";
    var midTag = "</td><td>";

    var html = beginTag + v[0] + midTag + v[1] + midTag + v[2] + midTag + v[3] + midTag + new Date(v[4] * 1000) + midTag + new Date(v[5] * 1000) + endTag;
    $('#mytable tbody').append(html);
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
