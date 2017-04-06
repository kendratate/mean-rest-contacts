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
        var data = findRemove(readdata, 'id', req.params.id);
        console.log(data);

        //fs.writeFileSync(contactsFile, JSON.stringify(data,null,2));

        fs.writeFile(contactsFile, JSON.stringify(data,null,2), function(err){
            if(err) {
                console.log(err);
                return;
            }
            res.end(JSON.stringify("Item Deleted"));
           console.log('writing to ' + contactsFile);
        });
        return data;
    });

    app.get('/sort', function(req, res){
        console.log("in sort");
        var readdata = JSON.parse(fs.readFileSync(contactsFile, 'utf8'));

        var data = readdata.contacts.sort(function(a, b){
            console.log(a);
            console.log(b);
            var x = a.firstname.toLowerCase();
            var y = b.firstname.toLowerCase();
            if(x < y) {return -1;}
            if(x > y) {return 1;}
            return 0;
        });
        readdata.contacts = data;
        fs.writeFile(contactsFile, JSON.stringify(readdata,null,2), function(err){
            if(err) {
                console.log(err);
                return;
            }
            res.end(JSON.stringify("Items Sorted"));
            console.log('writing to ' + contactsFile);
        });

        console.log(readdata);
        return readdata;
    })
};
