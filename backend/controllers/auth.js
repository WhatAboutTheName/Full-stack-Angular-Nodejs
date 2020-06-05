const User = require('../models/user');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
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
    const phoneNumber = req.body.phoneNumber;
    try {
        const hash = await bcrypt.hash(password, 12);
        const user = new User({
            name: name,
            email: email,
            password: hash,
            phoneNumber: phoneNumber
        });
        const saveUser = await user.save();
        res.status(201).json({ message: 'user created successfully!', userId: saveUser._id });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.login = async (req, res, next) => {
    let person;
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(401).json({message: 'Auth failed!'});
        }
        person = user;
        const compare = await bcrypt.compare(req.body.password, user.password);
        if (!compare) {
            return res.status(401).json({message: 'Auth failed!'});
        }
        const token = jwt.sign(
            {email: person.email, userId: person._id},
            "some_secret_key",
            {expiresIn: "1h"}
        );
        res.status(200).json({
            admin: person.admin,
            token: token,
            expiresIn: 3600,
            userId: person._id
        });
    } catch(err) {
        return res.status(401).json({message: 'Auth failed!'});
    }
}