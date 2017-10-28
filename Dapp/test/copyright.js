var Copyright = artifacts.require("./Copyright.sol");

contract('Copyright', function(accounts) {
    var instance = null;
    var ownerAddress = accounts[0];
    var ownerEmail = "jit@jitty.com";
    var oldDocName = "_docname02";
    var updatedDocName = "_docname99";
    var createdTS = Math.floor(new Date() / 1000);
    var updatedTS = Math.floor(new Date() / 1000);

    it("Copyright Contract should be able to 1:addContract 2:set/getOwner 3:getContractByName 4:getContractByIndex 5:getContractCount 6:updateContract AND 7:deleteContract on a contract document", function() {
        return Copyright.deployed().then(function(meta) {
            instance = meta;
            return instance.addContract("_docname01", "_doctype01", "_docurl01", "docSHA01", createdTS, updatedTS);
        }).then(function(result) {
            console.log("addContract:" + JSON.stringify(result));
            return instance.getContractByName("_docname01");
        }).then(function(result0) {
            console.log("getContractByName:" + result0);
            assert.equal(result0[0], "_docname01", "Contract added _docname01 should match the correspoing getContractByName");
            return instance.setOwner("jit@jitty.com");
        }).then(function(result1) {
            console.log("setOwner:" + JSON.stringify(result1));
            return instance.getOwner();
        }).then(function(result2) {
            console.log("getOwner:" + result2);
            assert.equal(result2[1], 'jit@jitty.com', "Contract should have owner set to jit@jitty.com");
            return instance.getContractByIndex.call(0);
        }).then(function(result3) {
            console.log("getContractByIndex:" + result3);
            assert.equal(result3[0], '_docname01', "Contract should be able to retrieve document by index");
            return instance.addContract("_docname02", "_doctype02", "_docurl02", "docSHA02", createdTS, updatedTS);
        }).then(function(result4) {
            console.log("addContract second time:" + JSON.stringify(result4));
            return instance.getContractByName("_docname02");
        }).then(function(result5) {
            console.log("getContractByName with second doc:" + result5);
            assert.equal(result5[0], '_docname02', "Contract should allow a second doc addition and retrieval");
            return instance.updateContract(ownerAddress, oldDocName, updatedDocName);
        }).then(function(noResult) {
            console.log("updateContract on second doc:" + JSON.stringify(noResult));
            return instance.getContractByName(updatedDocName);
        }).then(function(result6) {
            console.log("getContractByName on second doc:" + result6);
            assert.equal(result6[0], updatedDocName, "Contract should allow updating an existing document");
            return instance.deleteContract(ownerAddress, updatedDocName);
        }).then(function(result7) {
            console.log("deleteContract on second doc:" + JSON.stringify(result7));
        });
    });
});
