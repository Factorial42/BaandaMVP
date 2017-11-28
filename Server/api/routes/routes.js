'use strict';
module.exports = function(app) {
    var docList = require('../controllers/controller');

    app.route('/upload')
        .post(docList.upload_a_doc);

    //User
    app.route('/registerUser')
        .post(docList.create_a_user);
    app.route('/loginUser')
        .post(docList.login_a_user);
        app.route('/validateUser')
            .post(docList.validate_a_user);
            app.route('/users')
                .get(docList.list_all_users);

    app.route('/contracts')
        .get(docList.list_all_contracts);
        app.route('/uploadContract')
            .post(docList.upload_a_contract);
            app.route('/createContract')
                    .post(docList.create_a_contract);
    app.route('/contracts/:contractId')
        .get(docList.read_a_contract);
    app.route('/contractsByEmail/:email')
        .get(docList.list_all_contracts_by_email);

    app.route('/delete/:docId')
        .get(docList.remove_a_doc);

    app.route('/delete/:docName')
        .get(docList.remove_a_doc);


    // Routes
    app.route('/docs')
        .get(docList.list_all_docs)
        .post(docList.create_a_doc);

    app.route('/docs/:docId')
        .get(docList.read_a_doc)
        .put(docList.update_a_doc)
        .delete(docList.delete_a_doc);
};
