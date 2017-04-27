mongodb = require('mongodb');
const Connection = require('mongodb').Connection;
const Server = require('mongodb').Server;
const BSON = require('mongodb').BSON;
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;

module.exports = function(app) {
    var readdata = JSON.parse('{"contacts":[{}]}');

    //Heroku will assign port or default to 8000 to assign unique port for each run
    const port = parseInt(process.env.PORT,10) || 8080;

    var db
    var url = "mongodb://heroku_3xw67stx:cg8n2i6iep8ol6lndjpk644uvr@ds111791.mlab.com:11791/heroku_3xw67stx"
    // var url = "mongodb://localhost:27017/contacts";
    MongoClient.connect(url, (err,database) => {
        if (err) return console.log(err)
        db = database
        app.listen(port, () => {
            console.log('listening on ' + port)
        })
    });

    app.get(['/', '/search'], function (req, res) {
        db.collection('contactlist').find().toArray(function(err, contactlist){

            readdata.contacts = contactlist;
            //res.json(readdata);
            console.log(readdata);

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(JSON.stringify(readdata));
        });
    });


    app.get('/search/:searchterm', function (req, res){
        console.log("Search for: " + req.params.searchterm);
        var regexValue = '\.*'+req.params.searchterm+'\.*';
        db.collection('contactlist')
            .find({$or:[{"firstname": {$regex: regexValue, $options:'i'}},
                {lastname:{$regex: regexValue, $options:'i'}},
                {phone: {$regex: regexValue, $options:'i'}}]})
            .toArray(function(err, contactlist){

            readdata.contacts = contactlist;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(JSON.stringify(readdata));
        });
    });


   app.delete('/:id', function(req, res) {
       console.log("Delete param: " + req.params.id);

        db.collection('contactlist').deleteOne({_id:new mongodb.ObjectID(req.params.id)});

        db.collection('contactlist').find().toArray(function(err, contactlist) {
            readdata.contacts = contactlist;
            res.writeHead(200, {'Content-Type': 'text/html'});
           res.end(JSON.stringify(readdata));
        });
   });

    app.get('/sorta', function(req, res){

        db.collection('contactlist').find().sort({firstname: 1}).toArray(function(err, contactlist){

            readdata.contacts = contactlist;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(JSON.stringify(readdata));
        });
    });

    app.get('/sortd', function(req, res){

        db.collection('contactlist').find().sort({firstname: -1}).toArray(function(err, contactlist){

            readdata.contacts = contactlist;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(JSON.stringify(readdata));
        });
    });

    //Add or modify new contact
    app.post(['/', '/:id'], function(req, res){
        console.log(req.params.id);
        console.log(req.body);
        console.log(req.body.firstname);
        console.log(req.body.lastname);
        console.log(req.body.phone);
        try {
            console.log(req.body);
            db.collection('contactlist').updateOne(
                {_id: new mongodb.ObjectID(req.params.id)},
                {
                    $set: {
                        "firstname": req.body.firstname,
                        "lastname": req.body.lastname,
                        "phone": req.body.phone
                    }
                },
                {upsert: true}
            );
        } catch (e) {
            console.log(e);
        };

        db.collection('contactlist').find().toArray(function(err, contactlist) {
            readdata.contacts = contactlist;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(JSON.stringify(readdata));
        });
    });
};