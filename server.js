'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

const app = express();

const { PORT, DATABASE_URL } = require('./config')

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
      return res.send(204);
    }
    next();
});

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());

app.get('/transactions', function(req,res) {
    res.json(
        [{
            "id": "111",
            "description": "groceries",
            "amount": "100",
            "date": "01/01/2018",
            "category": "expense"
        },
        {
            "id": "222",
            "description": "movie tickets",
            "amount": "20",
            "date": "01/02/2018",
            "category": "expense"
        },
        {
            "id": "333",
            "description": "paycheck",
            "amount": "250",
            "date": "01/03/2018",
            "category": "income"
        },
        {
            "id": "444",
            "description": "Christmas money from Grandma",
            "amount": "100",
            "date": "01/01/2018",
            "category": "income"
        },
        {
            "id": "555",
            "description": "restaurant",
            "amount": "9",
            "date": "01/01/2018",
            "category": "expense"
        }]
    );
});

app.post('/transactions', function(req, res) {
    let transaction = req.body;
    console.log(req.body);
    let mockId = "1112";
    transaction.id = mockId;
    res.json(transaction);
});

app.get('/goals', function(req, res) {
    res.json(
       [{
            "id": "1111",
            "goal": "Spend less than $500 this month on food"
        },
        {
            "id": "2222",
            "goal": "Only buy paper towels once this month"
        },
        {
            "id": "3333",
            "goal": "Meet 50% of purchase predictions"
        }]
    );
});

app.post('/goals', function(req, res) {
    let goal = req.body;
    let mockId = "12345";
    goal.id = mockId,
    res.json(goal);
})

app.get('/', function(req, res) {
    res.json({'message': 'answer'});
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