'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');

const { PORT, DATABASE_URL } = require('./config')
const { router: transactionRouter } = require('./transactionRouter');
const { router: goalRouter } = require('./goalRouter');





mongoose.Promise = global.Promise;

const app = express();

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json({extended: true}));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
      return res.send(204);
    }
    next();
});

app.use('/transactions', transactionRouter);
app.use('/goals', goalRouter);

app.use('/users', usersRouter);
app.use('/auth', authRouter);

passport.use(localStrategy);
passport.use(jwtStrategy);
  
app.use('*', (req, res) => {
    return res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer(dbUrl = DATABASE_URL, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(dbUrl, {useMongoClient: true}, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve();
            })
            .on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing Server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
  }

module.exports = { app, runServer, closeServer };