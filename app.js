/**
 * Created by kendratate on 4/3/17.
 */
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const http = require('http');

const app = express();

app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({
    extended: true
}));

var contacts = require('./contacts.js')(app);
