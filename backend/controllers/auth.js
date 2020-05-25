const User = require('../models/user');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt
        .hash(password, 12)
        .then(pas => {
            const user = new User({
                name: name,
                email: email,
                password: pas
            });
            return user.save();
        })
        .then(result => {
            res.status(201).json({ message: 'user created successfully!', userId: result._id });
        })
        .catch(err => {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
        });
}

exports.login = (req, res, next) => {
    let person;
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({message: 'Auth failed!'});
            }
            person = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({message: 'Auth failed!'});
            }
            const token = jwt.sign({email: person.email, userId: person._id}, "some_secret_key", {expiresIn: "1h"});

            res.status(200).json({
                admin: person.admin,
                token: token,
                expiresIn: 3600,
                userId: person._id
            });
        })
        .catch(err => {
            return res.status(401).json({message: 'Auth failed!'});
        })
}