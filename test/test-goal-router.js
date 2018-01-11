'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const should = chai.should();

const { Goals } = require('../models');
const { app, runServer, closeServer } = require('../server');
const { DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function seedGoalData() {
    console.info('seeding goal data');
    const seedData = [];

    for (let i=0; i<=10; i++) {
        seedData.push({
            goal: faker.lorem.sentence()
        });
    }
    return Goals.insertMany(seedData);
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
  }

describe('Goal API resource', function() {
    before(function() {
        return runServer(DATABASE_URL);
      });
    
      beforeEach(function() {
        return seedGoalData();
      });
    
      afterEach(function() {
        return tearDownDb();
      });
    
      after(function() {
        return closeServer();
      });

      describe('GET endpoint', function() {
          it('should return all goals', function() {
              let res;
              let resGoal;
              return chai.request(app)
                .get('/goals')
                .then(function(res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.should.have.length.of.at.least(1);

                    res.body.forEach(function(goal) {
                        goal.should.be.a('object');
                        goal.should.include.keys('id', 'goal');
                    });

                    resGoal = res.body[0];
                    return Goals.findById(resGoal.id);
                })
                .then(function(goal) {
                    resGoal.id.should.equal(goal.id);
                });
          });
      });

      describe('POST endpoint', function() {
          it('should add a new goal', function() {
              const newGoal = {
                goal: faker.lorem.sentence()
            };
              
              return chai.request(app)
                .post('/goals')
                .send(newGoal)
                .then(function(res) {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('id', 'goal');
                    res.body.goal.should.equal(newGoal.goal);
                    res.body.id.should.not.be.null;
                });
          });
      });

      describe('PUT endpoint', function() {
          it('should update fields sent over', function() {
              const updateData = {
                  goal: "Put $500 into savings in January"
              };

              return Goals
                .findOne()
                .then(function(goal) {
                    updateData.id = goal.id;

                    return chai.request(app)
                        .put(`/goals/${goal.id}`)
                        .send(updateData);
                })
                .then(function(res) {
                    res.should.have.status(204)

                    return Goals.findById(updateData.id);
                })
                .then(function(goal) {
                    goal.goal.should.equal(updateData.goal);
                });
          });
      });

      describe('DELETE endpoint', function() {
        it('delete a goal by id', function() {
    
          let goal;
    
          return Goals
            .findOne()
            .then(function(_goal) {
              goal = _goal;
              return chai.request(app).delete(`/goals/${goal.id}`);
            })
            .then(function(res) {
              res.should.have.status(204);
              return Goals.findById(goal.id);
            })
            .then(function(_goal) {
              should.not.exist(_goal);
            });
        });
      });
  });