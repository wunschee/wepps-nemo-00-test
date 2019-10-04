'use strict';

module.exports = function (app) {
    let User = require('../../db/models/user.js');

    app.get('/api/user', function (req, res) {
        User.find(function (err, users) {
            if (err){
                return res.status(500).send('Error occured: database error');
            }

            res.json(users.map(function (user) {
                return {
                    Id: user._id,
                    UserName: user.UserName,
                    DateOfEntry: user.DateOfEntry
                };
            }));
        });
    });

    app.get('/api/user/:id', function (req, res) {
        User.findOne({_id: req.params.id}, function (err, user) {
            if (err || user === null){
                return res.status(500).send('Error occured: database error');
            }

            res.json({
                Id: user._id,
                UserName: user.UserName,
                DateOfEntry: user.DateOfEntry
            });
        });
    });

    app.post('/api/user', function (req, res) {
        new User({
            UserName: req.body.UserName
        }).save(function (err, user) {
            if (err) {
                return res.status(500).send('Error occurred: database error');
            }

            res.json({
                Id: user._id,
                UserName: user.UserName,
                DateOfEntry: user.DateOfEntry
            });
        });
    });

    app.put('/api/user/:id', function (req, res) {
        User.update({ _id: req.params.id }, { UserName: req.body.UserName }, function (err) {
            if (err){
                return res.status(500).send('Error occurred: database error');
            }

            res.send();
        }); 
    });

    app.delete('/api/user/:id', function (req, res) {
        User.remove({ _id: req.params.id }, function (err) {
            if (err) {
                return res.status(500).send('Error occurred: database error');
            }

            return res.send();
        });
    });
}