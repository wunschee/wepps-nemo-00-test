'use strict';

let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    Id: {
        type: Number,
        required: true
    },
    UserName: {
        type: String,
        required: true
    },
    DateOfEntry: {
        type: Date,
        default: Date.now()
    }
});

let User = mongoose.model('User', userSchema);

module.exports = User;