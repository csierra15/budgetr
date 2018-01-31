'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const should = chai.should();

const { Transactions } = require('../models');
const { app, runServer, closeServer } = require('../server');
const { DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function seedTransactionData() {
    console.info('seeding transaction data');
    const seedData = [];

    for (let i=0; i<=10; i++) {
        seedData.push({
            description: faker.lorem.words(),
            amount: faker.finance.amount(),
            date: faker.date.recent(),
            category: faker.finance.transactionType()
        });
    }
    return Transactions.insertMany(seedData);
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
  }

describe('Transaction API resource', function() {
    before(function() {
        return runServer(DATABASE_URL);
      });
    
      beforeEach(function() {
        return seedTransactionData();
      });
    
      afterEach(function() {
        return tearDownDb();
      });
    
      after(function() {
        return closeServer();
      });

      describe('GET endpoint', function() {
          it('should return all transactions', function() {
              let res;
              let resTransaction;
              return chai.request(app)
                .get('/transactions')
                .then(function(res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.should.have.length.of.at.least(1);

                    res.body.forEach(function(transaction) {
                        transaction.should.be.a('object');
                        transaction.should.include.keys('id', 'description', 'amount', 'date', 'category');
                    });

                    resTransaction = res.body[0];
                    return Transactions.findById(resTransaction.id);
                })
                .then(function(transaction) {
                    resTransaction.id.should.equal(transaction.id);
                });
          });
      });

      describe('POST endpoint', function() {
          it('should add a new transaction', function() {
              const newTransaction = {
                description: faker.lorem.words(),
                amount: faker.finance.amount(),
                date: faker.date.recent(),
                category: faker.finance.transactionType()
            };
              
              return chai.request(app)
                .post('/transactions')
                .send(newTransaction)
                .then(function(res) {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('id', 'description', 'amount', 'date', 'category');
                    res.body.description.should.equal(newTransaction.description);
                    res.body.id.should.not.be.null;
                });
          });
      });
  

      describe('DELETE endpoint', function() {
        it('should delete a transaction by id', function() {
    
          let transaction;
    
          return Transactions
            .findOne()
            .then(function(_transaction) {
              transaction = _transaction;
              return chai.request(app).delete(`/transactions/${transaction.id}`);
            })
            .then(function(res) {
              res.should.have.status(200);
              return Transactions.findById(transaction.id);
            })
            .then(function(_transaction) {
              should.not.exist(_transaction);
            });
        });
      });
  });