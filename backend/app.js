const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routers/auth');
const adminRoutes = require('./routers/admin');
const allRoutes = require('./routers/routes');

const mongoose = require('mongoose');

const app = express();

const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    next();
});

app.use('/user', authRoutes);
app.use('/admin', adminRoutes);
app.use('/all', allRoutes);

mongoose
    .connect(
        'mongodb+srv://WATN:123qwe123@cluster0-igf25.mongodb.net/shop', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(result => {
        const server = app.listen(port);
        const io = require('./socket').init(server);
        io.on('connection', socket => {
            console.log('Server has been started...');
        });
    })
    .catch(err => {
        console.log(err);
    });

module.exports = app;
