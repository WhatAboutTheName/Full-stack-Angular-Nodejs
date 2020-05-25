const express = require('express');
const { body } = require('express-validator/check');
const signup = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.put(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Invalid email')
            .custom(value => {
                return User.findOne({email: value}).then(user => {
                    if (user) {
                        return Promise.reject('Email already exists');
                    }
                })
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({min: 6})
    ]
    ,signup.signup);

router.post('/login', signup.login);

module.exports = router;
