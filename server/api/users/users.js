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
                    Id: user.Id,
                    UserName: user.UserName,
                    DateOfEntry: user.DateOfEntry
                };
            }));
        });
    });

    app.get('/api/user/:id', function (req, res) {
        User.findOne({Id: req.params.id}, function (err, user) {
            if (err || user === null){
                return res.status(500).send('Error occured: database error');
            }

            res.json({
                Id: user.Id,
                UserName: user.UserName,
                DateOfEntry: user.DateOfEntry
            });
        });
    });

    app.post('/api/user', function (req, res) {
        new User({
            Id: req.body.Id,
            UserName: req.body.UserName
        }).save(function (err, user) {
            if (err) {
                return res.status(500).send('Error occurred: database error');
            }

            res.json({
                Id: user.Id,
                UserName: user.UserName,
                DateOfEntry: user.DateOfEntry
            });
        });
    });

    app.put('/api/user/:id', function (req, res) {
        User.update({ Id: req.params.id }, { UserName: req.body.UserName }, function (err) {
            if (err){
                return res.status(500).send('Error occurred: database error');
            }

            res.send();
        }); 
    });

    app.delete('/api/user/:id', function (req, res) {
        User.remove({ Id: req.params.id }, function (err) {
            if (err) {
                return res.status(500).send('Error occurred: database error');
            }

            return res.send();
        });
    });
}