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

router.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.updatedTrans.id && req.params.id === req.body.updatedTrans.id)) {
        console.log(`${req.body.updatedTrans.id}`);
        res.status(400).json({
          error: `Request path id ${req.params.id} and request body id ${req} values must match`
        });
      }
    
      const updated = {};
      const updateableFields = ['description', 'amount', 'date', 'category'];
      updateableFields.forEach(field => {
        if (field in req.body.updatedTrans) {
          updated[field] = req.body.updatedTrans[field];
        }
      });
      console.log(req.params.id, updated);

      Transactions
        .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
        .then(updatedTransaction => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Could not update' }));
    
});

router.delete('/:id', (req, res) => {
    Transactions
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).json({message: `Transaction \`${req.params.id}\` was deleted`});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Could not DELETE'});
        });
});

module.exports = { router };