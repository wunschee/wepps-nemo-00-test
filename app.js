'use strict';

let express = require('express');
let bodyParser = require('body-parser');
// create express instance
let app = express();

app.set('port', process.env.PORT || 4000);
app.set('ipaddr', process.env.IP || "127.0.0.1");

// body parser middleware to handle URL parameter and JSON bodies
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// serve static files
app.use(express.static(__dirname + '/client/app'));

// connect to mongoDB
require('./server/db/mongo-connect.js')();

// client express routes
require('./client/routes/routes.js')(app);

// api
require('./server/api/users/users.js')(app);

// express app listener
app.listen(app.get('port'), function () {
    console.log('Express server ' + app.get('ipaddr') + ' listening on port ' + app.get('port'));
});