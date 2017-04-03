var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');

module.exports = function(app){
    var contactsFile = path.join(__dirname, 'contacts.json');

    function findRemove(arr, property, item){
        var i = arr.length;

        while(i--) {
            if (arr[i]
                && arr[i].hasOwnProperty(property)
                && (arguments.length > 2 && arr[i][property] === item )) {
                arr.splice(i, 1);
            }
        }
        return arr;
    }

    app.get('/', function (req, res){
        res.type('application/json');
        var readable = fs.createReadStream(contactsFile);
        readable.pipe(res);
    });

    app.delete('/:id', function(req,res) {
        console.log("in delete");
        var readdata = JSON.parse(fs.readFileSync(contactsFile, 'utf8'));
        var data = findRemove(readdata.contacts, 'id', req.params.id);
        console.log(data);
        fs.writeFile(contactsFile, JSON.stringify(data), function(err){
            if(err) returnconsole.log(err);
            console.log('writing to ' + contactsFile);
        });
        console.log(data);
    });
};
