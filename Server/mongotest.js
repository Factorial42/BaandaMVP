var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/DocDB";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var myquery = { name: 'ML Tool Kits' };
  db.collection("docs").remove(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
  });
});
