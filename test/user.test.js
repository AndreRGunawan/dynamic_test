const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { queryInterface } = sequelize;
const bcrypt = require('bcrypt');

const user1 = {
  email: 'user1@mail.com',
  password: 'qweqwe'
};

afterAll(done => {
  queryInterface
    .bulkDelete('Users')
    .then(() => {
      console.log('Db clean up... ');
      done();
    })
    .catch(err => {
      console.log(err);
      done(err);
    });
});

beforeAll(done => {
  const salt = bcrypt.genSaltSync(10);
  const user1HashPassword = bcrypt.hashSync(user1.password, salt);
  queryInterface
    .bulkInsert('Users', [
      {
        email: user1.email,
        password: user1HashPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
    .then(() => {
      console.log('User created: ' + user1.email);
      done();
    })
    .catch(err => {
      done(err);
    });
});

describe('User', () => {
  describe('POST /register', () => {
    describe('success register user', () => {
      test('should send an object with user id and email', done => {
        const userInput = {
          email: 'mail@mail.com',
          password: 'qweqwe'
        };
        request(app)
          .post('/register')
          .send(userInput)
          .end((err, response) => {
            if (err) {
              console.log('There is some error: ', err);
              return done(err);
            } else {
              expect(response.status).toBe(201);
              expect(response.body).toHaveProperty('id', expect.any(Number));
              expect(response.body).toHaveProperty('email', userInput.email);
              expect(response.body).not.toHaveProperty('password');
              return done();
            }
          });
      });
    });
    describe('error register user', () => {
      test('should send error and status 400 because missing email and password', done => {
        const errors = [
          {
            message: 'Email is required field'
          },
          {
            message: 'Password is required field'
          }
        ];
        request(app)
          .post('/register')
          .end((err, response) => {
            if (err) {
              console.log('There is some error: ', err);
              return done(err);
            } else {
              expect(response.status).toBe(400);
              expect(response.body).toHaveProperty('errors', errors);
              return done();
            }
          });
      });
      test('should send error and status 400 because password less than 6 characters', done => {
        const userInput = {
          email: 'mail@mail.com',
          password: 'qwe'
        };
        const errors = [
          {
            message: 'Password at least have 6 characters'
          }
        ];
        request(app)
          .post('/register')
          .send(userInput)
          .end((err, response) => {
            if (err) {
              console.log('There is some error: ', err);
              return done(err);
            } else {
              expect(response.status).toBe(400);
              expect(response.body).toHaveProperty('errors', errors);
              return done();
            }
          });
      });
      test('should send error and status 400 because email already exists.', done => {
        const errors = [
          {
            message: 'Email already exists.'
          }
        ];
        request(app)
          .post('/register')
          .send(user1)
          .end((err, response) => {
            if (err) {
              console.log('There is some error: ', err);
              return done(err);
            } else {
              console.log(response.body);
              expect(response.status).toBe(400);
              expect(response.body).toHaveProperty('errors', errors);
              return done();
            }
          });
      });
    });
  });
  describe('POST /login', () => {
    describe('success login', () => {
      test('should send access token and status 200', done => {
        request(app)
          .post('/login')
          .send(user1)
          .end((err, response) => {
            if (err) {
              console.log('There is some error: ', err);
              return done(err);
            } else {
              expect(response.status).toBe(200);
              expect(response.body).toHaveProperty('token');
              return done();
            }
          });
      });
    });
  });
});
