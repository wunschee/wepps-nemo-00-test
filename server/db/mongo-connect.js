'use strict';

let mongoose = require('mongoose');
let config = require('config');
let db = config.get('mongoURI');

mongoose.Promise = global.Promise;

module.exports = function () {
    mongoose
        .connect(db, { dbName: 'test', useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
        .then(() => console.log('Atlas MongoDB cloud service connected at ' + db))
        .catch(err => console.log(err));
}