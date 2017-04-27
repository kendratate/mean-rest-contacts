/**
 * Created by kendratate on 4/3/17.
 */
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const http = require('http');

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var contacts = require('./contacts.js')(app);
