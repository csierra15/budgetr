'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const uuid = require('uuid');

const incomeSchema = mongoose.Schema ({
    listName: {type: String, required: true},
    content: [{
        name: {type: String, required: true},
        department: {type: String, required: true}
    }],
    publishedAt: {type: Date, default: Date.now}
});

incomeSchema.methods.serialize = function() {
    return {
        id: this._id,
        listName: this.listName,
        content: this.content,
        publishedAt: this.publishedAt
    };
};

const expenseSchema = mongoose.Schema ({
    name: {type: String, required: true},
    state: {type: String, required: true},
    city: {type: String, required: true},
    products: [{
        aisle: {type: String, required: true}
    }]
});

expenseSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        state: this.state,
        city: this.city,
        products: this.products
    };
};

const goalSchema = mongoose.Schema ({
    name: {type: String, required: true},
    state: {type: String, required: true},
    city: {type: String, required: true},
    products: [{
        aisle: {type: String, required: true}
    }]
});

goalSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        state: this.state,
        city: this.city,
        products: this.products
    };
};

const Income = mongoose.model('Income', incomeSchema);
const Expense = mongoose.model('Expense', expenseSchema);
const Goal = mongoose.model('Goal', GoalSchema);

module.exports = { Income, Expense, Goal };