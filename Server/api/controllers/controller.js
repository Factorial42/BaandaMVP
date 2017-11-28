'use strict';
const UTIL = require('../utils/util.js');
const GETH = require('../utils/geth.js');
var objectID = require('mongodb').ObjectID;
var mongoose = require('mongoose'),
  Doc = mongoose.model('Doc'),
  User = mongoose.model('User'),
  Contract = mongoose.model('Contract');

exports.list_all_docs = function(req, res) {
    Doc.find({}, function(err, doc) {
        if (err)
            res.send(err);

        var arr = [];
        for (var i = 0; i < doc.length; i++) {
            var myObj = new Object();
            myObj.id = doc[i]._id;
            myObj.name = doc[i].name;
            myObj.s3path = doc[i].s3path;
            myObj.created_date = doc[i].created_date;
            arr.push(myObj);
        }
        res.json(arr);
    });
};
exports.list_all_users = function(req, res) {
    User.find({}, function(err, doc) {
        if (err)
            res.send(err);

        var arr = [];
        for (var i = 0; i < doc.length; i++) {
            var myObj = new Object();
            myObj.id = doc[i]._id;
            myObj.name = doc[i].name;
            myObj.email = doc[i].email;
            myObj.created_date = doc[i].created_date;
            arr.push(myObj);
        }
        res.json(arr);
    });
};

exports.list_all_contracts = function(req, res) {
    Contract.find({}, function(err, doc) {
        if (err)
            res.send(err);

        var arr = [];
        for (var i = 0; i < doc.length; i++) {
            var myObj = new Object();
            myObj.id = doc[i]._id;
            myObj.contract_address = doc[i].contract_address;
            myObj.contract_name = doc[i].contract_name;
            myObj.contract_owner_address = doc[i].contract_owner_address;
            myObj.contract_owner_email = doc[i].contract_owner_email;
            myObj.contract_abi_artifacts = doc[i].contract_abi_artifacts;
            myObj.created_date = doc[i].created_date;
            arr.push(myObj);
        }
        res.json(arr);
    });
};

exports.list_all_contracts_by_email = function(req, res) {
  console.log("Req params is: " + JSON.stringify(req.params, null, 2))

    Contract.find({  contract_owner_email: req.params.email}, function(err, doc) {
        if (err)
            res.send(err);

        var arr = [];
        for (var i = 0; i < doc.length; i++) {
            var myObj = new Object();
            myObj.id = doc[i]._id;
            myObj.contract_address = doc[i].contract_address;
            myObj.contract_name = doc[i].contract_name;
            myObj.contract_owner_address = doc[i].contract_owner_address;
            myObj.contract_owner_email = doc[i].contract_owner_email;
            myObj.contract_abi_artifacts = doc[i].contract_abi_artifacts;
            myObj.created_date = doc[i].created_date;
            arr.push(myObj);
        }
        res.json(arr);
    });
};

//delete a doc by name or id
exports.remove_a_doc = function(req, res) {
    var docId = req.params.docId;
    console.log('Doc successfully deleted with ID/Name *' + docId);
    if (objectID.isValid(docId)) {
        Doc.remove({
            _id: docId
        }, function(err, doc) {
            if (err)
                console.log(err);
            res.json({
                message: 'Doc successfully deleted with ID *' + docId
            });
        });
    } else {
        Doc.remove({
            name: docId
        }, function(err, doc) {
            if (err)
                console.log(err);
            res.json({
                message: 'Doc successfully deleted with name *' + docId
            });
        });
        UTIL.delete(docId, function(data) {
            console.log("Deleting S3 doc:--" + JSON.stringify(data, null, 4));
        });

    }
}

exports.create_a_user = function(req, res) {
    console.log("Req body is: " + JSON.stringify(req.body, null, 2))

    var _user = new User();
    _user.name = req.body.name;
    _user.email = req.body.email;
    _user.password = req.body.password;
    _user.mobile = req.body.mobile;
    console.log("@User:" + JSON.stringify(_user));

    if (_user.name !== 'undefined') {
        _user.save(function(err, _savedUser) {
            if (err) {
                console.log("create_a_user @ERROR ::" + err);
            } else {
                res.send(_savedUser);
                console.log(_savedUser.name + " registered!");
            }
        });
    } else {
        res.status(504).send("Server side error: Possibly User Register failed!");
    }
}

exports.validate_a_user = function(req, res) {
    console.log("Req body is: " + JSON.stringify(req.body, null, 2))
    if (req.body.email !== 'undefined') {
        User.findOne({
            email: req.body.email
        }, function(err, _user) {
            if (err)
                res.send(err);
            res.json(_user);
        });
    } else {
        res.status(504).send("Server side error: User query for email failed!");
    }

}

exports.login_a_user = function(req, res) {
    console.log("Req body is: " + JSON.stringify(req.body, null, 2))
    if (req.body.email !== 'undefined' && req.body.password != 'undefined') {
        User.findOne({
            email: req.body.email,
            password: req.body.password
        }, function(err, _user) {
            if (err)
                res.send(err);
            res.json(_user);
        });
    } else {
        res.status(504).send("Server side error: User query errored!");
    }

}


exports.create_a_contract = function(req, res) {
    console.log("Req body is: " + JSON.stringify(req.body, null, 2))
    if (req.body.type !== 'Copyrighting Smart Contract')
      res.status(500).send("Server doesn't support requested contract!");
    else{
    GETH.deployContract(req.body.type,req.body.email,function(callback){
      console.log ("@create_a_contract:deployContract:" + callback);
      res.send(callback);
    });
  }
}


exports.upload_a_contract = function(req, res) {
    //console.log("Req body is: " + JSON.stringify(req.body, null, 2))
    //console.log("Req params is: " + JSON.stringify(req.params, null, 2))
    //console.log("Req query is: " + JSON.stringify(req.query, null, 2))

    var _contract = new Contract();
    _contract.contract_address = req.body.contract_address;
    _contract.contract_name = req.body.contract_name;
    _contract.contract_owner_address = req.body.contract_owner_address;
    _contract.contract_owner_email = req.body.contract_owner_email;
    //_contract.contract_abi_artifacts = JSON.stringify(req.body.contract_abi_artifacts);
    _contract.contract_abi_artifacts = (req.body.contract_abi_artifacts);


    //Save doc to Mongo
    if (_contract.contract_address !== 'undefined') {
        _contract.save(function(err, _contract) {
            if (err) {
                console.log("ERROR ::" + err);
            } else {
                //console.log(JSON.stringify(_contract, null, 2))
                res.send(_contract);
                console.log(_contract.contract_address + " successfully saved to Mongo");
            }
        });
    } else {
        res.status(504).send("Server side error: Possibly Contract save failed!");
    }
}

exports.upload_a_doc = function(req, res) {
    if (!req.files)
        return res.status(400).send('Duh!! No files were uploaded.');
    console.log("Req body is: " + JSON.stringify(req.body, null, 2))
    console.log("Req file is: " + req.files)

    let testFile = req.files.foo;

    console.log("#NAME=" + req.files.foo.name);
    console.log("#MIME=" + req.files.foo.mimetype);
    console.log("#DATA=" + req.files.foo.data);


    //persist the doc
    var _doc = new Doc();
    _doc.name = req.files.foo.name;
    _doc.body = req.files.foo.data;
    _doc.contract_address = req.body.contract_address;


    //save doc to S3
    UTIL.upload(_doc, function(data) {
        if (data)
            console.log("Saving Doc:--" + _doc.name + " --:to S3@" + JSON.stringify(data, null, 4));
        console.log('File uploaded successfully!');

        //set the encrypted hash of the doc
        _doc.SHA256 = UTIL.encryptSHA256(_doc);
        //set the s3path n persist to mongo
        _doc.s3path = data.Location;

        //Save doc to Mongo
        _doc.save(function(err, _doc) {
            if (err) {
                //res.send(err);
                console.log("ERROR ::" + err);
                //res.send(_doc);
            } else {
                UTIL.print(_doc);
                res.send(_doc);
                console.log(_doc.name + " Successfully uploaded to both mongo and S3 @ \n " + JSON.stringify(data, null, 2) + " with SHA256 hash=" + _doc.SHA256);
            }
        });
    });
}

exports.create_a_doc = function(req, res) {
    var new_doc = new Doc(req.body);
    console.log("Body is" + new_doc);
    new_doc.save(function(err, doc) {
        if (err)
            res.send(err);
        res.json(doc);
    });
};


exports.read_a_doc = function(req, res) {
    Doc.findById(req.params.docId, function(err, doc) {
        if (err)
            res.send(err);
        res.json(doc);
    });
};

exports.read_a_contract = function(req, res) {
    if (req.params.contractId != ':contractId' && req.params.contractId != 'undefined') {
        Contract.findOne({
            contract_address: req.params.contractId
        }, function(err, contract) {
            if (err)
                res.send(err);
            res.json(contract);
        });
    } else {
        res.status(504).send("Server side error: Possibly Contract ID is invalid!");
    }
};


exports.update_a_doc = function(req, res) {
    Doc.findOneAndUpdate({
        _id: req.params.docId
    }, req.body, {
        new: true
    }, function(err, doc) {
        if (err)
            res.send(err);
        res.json(doc);
    });
};


exports.delete_a_doc = function(req, res) {
    Doc.remove({
        _id: req.params.docId
    }, function(err, doc) {
        if (err)
            res.send(err);
        res.json({
            message: 'Doc successfully deleted'
        });
    });
};
