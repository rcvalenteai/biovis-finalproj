const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://bigdatamanagement:Bigdatafresh2020%3F@mongosandbox-qzmsu.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    const collection = client.db("projectfour").collection("recipes");
    // perform actions on the collection object
    var query = {preparation_time: "35 minutes"};
    collection.find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result)
    });
    client.close();
});

// Start connection to mongodb