const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Goals } = require('./models');

router.get('/', (req, res) => {
    Goals
        .find()
        .then(goals => {
            res.json(goals.map(goal => goal.serialize()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Could not GET'});
        });
});

router.get('/:id', (req, res) => {
    Goals
        .findById(req.params.id)
        .then(goal => res.json(goal.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Could not GET'});
        });
});

router.post('/', (req, res) => {
    const requiredFields = ['goal'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

Goals
    .create({
        goal: req.body.goal
    })
    .then(goals => res.status(201).json(goals.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Could not create new goal'});
    });
});

router.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.goal.id && req.params.id === req.body.goal.id)) {
        console.log(`${req}`);
        console.log(`${req.body.goal}`);
        console.log(`${req.body.goal.id}`);
        res.status(400).json({
          error: `Request path id ${req.params.id} and request body id ${req.body.goal.id} values must match`
        });
      }
    
      const updated = {};
      const updateableFields = ['goal'];
      updateableFields.forEach(field => {
        if (field in req.body.goal) {
          updated[field] = req.body.goal[field];
        }
      });
      console.log(req.params.id, updated);
      
      Goals
        .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
        .then(updatedGoal => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Could not update' }));
    
});

router.delete('/:id', (req, res) => {
    Goals
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).json({message: `Goal \`${req.params.id}\` was deleted`});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Could not delete'});
        });
});

module.exports = { router };