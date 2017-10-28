const Copyright = artifacts.require("./Copyright.sol");

contract('Copyright', function(accounts) {
  let ownerAddress = accounts[0];
  let ownerEmail = "jit@jitty.com";

  it("should allow adding a Copyright Contract - first record should have index of 1", async function () {
    let meta = await Copyright.deployed();
    let result = await meta.addContract("_docname01", "_doctype01", "_docurl01", "docSHA01", 10, 100);
    let temp = await meta.setOwner(ownerEmail);
    let owner = await meta.getOwner();
    let contractRecord = await meta.getContractByName("_docname01",{ from: ownerAddress });

    console.log ("addContract resulted in:" + JSON.stringify(result));
    console.log ("getOwner resulted in:" + JSON.stringify(temp) + ":" + owner);
    console.log ("getContractByName resulted in:" + JSON.stringify(contractRecord));

    assert.equal(result,1,"should have index set to 1 for init record");
    assert.equal(owner[1],ownerEmail,"should have owner email set to " + ownerEmail);
    assert.equal(contractRecord[0],"_docname01","should have retrieved record with docName of *_docname01");
  });
/*
  it("should have owner set to the contract creator address", async function () {
    let meta = await Copyright.deployed();
      let ownerName = await meta.getOwner.call();
    console.log ("getOwner resulted in:" + ownerName);
    assert.equal(ownerName[0],ownerAddress,"should have contract owner initialized to " + ownerAddress);
  });

  it("should have ability to set/get owner email", async function () {
    let meta = await Copyright.deployed();
      let temp = await meta.setOwner.call(ownerEmail);
      let result = await meta.getOwner.call();
    console.log ("getOwner Email resulted in:" + result);
    assert.equal(result[1],ownerEmail,"should have contract owner email " + ownerEmail);
  });

  it("should allow getting a Copyright Contract by Index ..say 1", async function () {
    let meta = await Copyright.deployed();
    let result = await meta.getContractByName.call("_docname01");
    console.log ("getContractByName resulted in:" + result);
    console.log ("getOwner resulted in:" + owner);
    assert.equal(result[0],"_docname01","should have contract name matching *_docname01*");
  });

  it("should allow adding n number of Contract - nth record should have index of n", async function () {
    if (meta == null )
      meta = await Copyright.deployed();
    let result = await meta.addContract.call("_docname02", "_doctype02", "_docurl02", "docSHA02", 2, 2);
    console.log ("add2Contract resulted in:" + result);
    assert.equal(result,2,"should have index set to 2 for second record");
  });
*/
});
