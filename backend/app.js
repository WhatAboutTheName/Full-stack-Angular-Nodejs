const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routers/auth');
const adminRoutes = require('./routers/admin');
const allRoutes = require('./routers/routes');

const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/images", express.static(path.join("backend/images")));

mongoose
    .connect(
        'mongodb+srv://WATN:123qwe123@cluster0-igf25.mongodb.net/shop', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(result => {
        console.log('Server has been started...');
    })
    .catch(err => {
        console.log(err);
    });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    next();
});

app.use('/shop/user', authRoutes);
app.use('/shop/admin', adminRoutes);
app.use('/shop/all', allRoutes);

module.exports = app;
