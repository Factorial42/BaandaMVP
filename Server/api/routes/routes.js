'use strict';
module.exports = function(app) {
  var docList = require('../controllers/controller');

  app.route('/upload')
  .post(docList.upload_a_doc);

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
