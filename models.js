'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const uuid = require('uuid');

const transactionSchema = mongoose.Schema ({
    description: {type: String, required: true},
    amount: {type: String, required: true},
    date: {type: String, required: true},
    category: {type: String, required: true},
});

transactionSchema.methods.serialize = function() {
    return {
        id: this._id,
        description: this.description,
        amount: this.amount,
        date: this.date,
        category: this.category
    };
};

const goalSchema = mongoose.Schema ({
    goal: {type: String, required: true},
});

goalSchema.methods.serialize = function() {
    return {
        id: this._id,
        goal: this.goal
    };
};

const Transactions = mongoose.model('Transaction', transactionSchema);
const Goals = mongoose.model('Goal', goalSchema);

module.exports = { Transactions, Goals };