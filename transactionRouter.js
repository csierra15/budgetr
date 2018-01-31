const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Transactions } = require('./models');

router.get('/', (req, res) => {
    Transactions
        .find()
        .then(transactions => {
            res.json(transactions.map(transaction => transaction.serialize()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Could not GET'});
        });
});

router.get('/:id', (req, res) => {
    Transactions
        .findById(req.params.id)
        .then(transaction => res.json(transaction.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Could not GET'});
        });
});

router.post('/', (req, res) => {
    const requiredFields = ['description','amount', 'date', 'category'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

Transactions
    .create({
        description: req.body.description,
        amount: req.body.amount,
        date: req.body.date,
        category: req.body.category
    })
    .then(transactions => res.status(201).json(transactions.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Could not create new transaction'});
    });
});

router.delete('/:id', (req, res) => {
    Transactions
        .findByIdAndRemove(req.params.id)
        .then(() => {
            Transactions
                .find()
                .then(transactions => {
                    console.log(transactions);
                    res.json(transactions.map(transaction => transaction.serialize()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Could not GET'});
        });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Could not DELETE'});
        });
});

module.exports = { router };