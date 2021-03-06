import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';

import server from '../server/app';
import pool from '../server/models/pool';

should();
use(chaiHttp);

process.env.NODE_ENV === 'test';

describe('Test suites', () => {
  after(() => {
    pool
      .query(
        `
        DELETE FROM users WHERE email = 'c@gmail.com';`
      )
      .then()
      .catch();
  });
  after(() => {
    pool
      .query(
        `
        DELETE FROM bookings WHERE email = 'j@gmail.com';`
      )
      .then()
      .catch();
  });
  context('POST /auth/signup', () => {
    it('should signup new user', done => {
      const user = {
        first_name: 'a',
        last_name: 'b',
        email: 'c@gmail.com',
        password: 'defghi'
      };
      request(server)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('should return error if user already exists', done => {
      const user = {
        first_name: 'a',
        last_name: 'b',
        email: 'c@gmail.com',
        password: 'defghi'
      };
      request(server)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(409);
          done();
        });
    });
  });
  context('POST /auth/signin', () => {
    it('should signin registered user', done => {
      const user = {
        email: 'c@gmail.com',
        password: 'defghi'
      };
      request(server)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('should return error if email is wrong', done => {
      const user = {
        email: 'q@gmail.com',
        password: 'defghi'
      };
      request(server)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('should return error if password is wrong', done => {
      const user = {
        email: 'c@gmail.com',
        password: 'nmopqrst'
      };
      request(server)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  context('POST /bookings/createBooking', () => {
    it('should create new booking', done => {
      const booking = {
        token: '23',
        booking_id: '1',
        bus_id: '1',
        seat_number: '1',
        first_name: 'f',
        last_name: 'g',
        email: 'j@gmail.com'
      };
      request(server)
        .post('/api/v1/bookings/')
        .set(
          'token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsIl9lbWFpbCI6ImVtYWlsQGVtYWlsLmNvbSIsIl9pc2FkbWluIjpmYWxzZSwiaWF0IjoxNTYzMjMwNDIwfQ.3F34ikIk94ZEmZ5F9CXkgvTJ1UMextWEb-ss9saBNL8'
        )
        .send(booking)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('should return error if email is used already', done => {
      const booking = {
        token: '23',
        booking_id: '1',
        bus_id: '1',
        seat_number: '1',
        first_name: 'f',
        last_name: 'g',
        email: 'j@gmail.com'
      };
      request(server)
        .post('/api/v1/bookings')
        .set(
          'token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsIl9lbWFpbCI6ImVtYWlsQGVtYWlsLmNvbSIsIl9pc2FkbWluIjpmYWxzZSwiaWF0IjoxNTYzMjMwNDIwfQ.3F34ikIk94ZEmZ5F9CXkgvTJ1UMextWEb-ss9saBNL8'
        )
        .send(booking)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });
});
