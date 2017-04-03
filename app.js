/**
 * Created by kendratate on 4/3/17.
 */
var express = require('express');
var fs = require('fs');
var path = require('path');
var http = require('http');

var app = express();

app.get('/', function (req, res){
   res.send('hello client');
});

var server = app.listen(3000, function(){
    console.log("Server is listening on port 3000");
});