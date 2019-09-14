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
                    id: user.id,
                    user_name: user.user_name
                };
            }));
        });
    });

    app.get('/api/user/:id', function (req, res) {
        User.findOne({id: req.params.id}, function (err, user) {
            if (err || user === null){
                return res.status(500).send('Error occured: database error');
            }

            res.json({
                id: user.id,
                user_name: user.user_name
            });
        });
    });

    app.post('/api/user', function (req, res) {
        new User({
            id: req.body.id,
            user_name: req.body.user_name
        }).save(function (err, user) {
            if (err) {
                return res.status(500).send('Error occurred: database error');
            }

            res.json({
                id: user.id
            });
        });
    });

    app.delete('/api/user/:id', function (req, res) {
        User.remove({ id: req.params.id }, function (err) {
            if (err) {
                return res.status(500).send('Error occurred: database error');
            }

            return res.send();
        });
    });

    app.put('/api/user/:id', function (req, res) {
        User.update({ 
            id: req.params.id
        }, {
            user_name: req.body.user_name  
        }, function (err) {
            if (err){
                return res.status(500).send('Error occurred: database error');
            }

            res.send();
        }); 
    });
}