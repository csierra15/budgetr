'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require('../server.js');

chai.should();

chai.use(chaiHttp);

describe('index page', function () {
  it('should exist', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        res.should.have.status(200);
      });
  });
});

describe('signup page', function () {
    it('should exist', function () {
      return chai.request(app)
        .get('/signup.html')
        .then(function (res) {
          res.should.have.status(200);
        });
    });
  });

  