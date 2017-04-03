/**
 * Created by kendratate on 4/3/17.
 */
var express = require('express');

var http = require('http');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var contacts = require('./contacts.js')(app);


var server = app.listen(3000, function(){
    console.log("Server is listening on port 3000");
});