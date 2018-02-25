const request = require('supertest');
const { expect } = require('chai');
const faker = require('faker');
const app = require('../../app');

describe('User-related endpoints', () => {

  const rightUser = {
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  let token;

  it('creates a new user', async () => {
    request(app)
      .post('/public/signup')
      .send(rightUser)
      .expect(201)
      .end((err, response) => {
        expect(response.body).to.have.keys('token');
      });
  });

  it('should not create a user if there\'s no email and/or password', async () => {
    request(app)
      .post('/public/signup')
      .send({
        email: faker.internet.email()
      })
      .expect(422)
      .end((err, response) => expect(response.body).to.equal('E-mail and password are required!'));

    request(app)
      .post('/public/signup')
      .send({
        password: faker.internet.password()
      })
      .expect(422)
      .end((err, response) => expect(response.body).to.equal('E-mail and password are required!'));
  });

  it('should not create another user with the same email', async () => {
    request(app)
      .post('/public/signup')
      .send(rightUser)
      .expect(422)
      .end((err, response) => {
        expect(response.body).to.equal('E-mail address already in use');
      });
  });

  it('authenticates a user', async () => {
    request(app)
      .post('/public/signin')
      .send(rightUser)
      .expect(200)
      .end((err, response) => {
        expect(response.body).to.have.keys('token');

        token = response.body.token;
      });
  });

  it('denies access to non-existent user', async () => {
    request(app)
      .post('/public/signin')
      .send({
        email: faker.internet.email(),
        password: faker.internet.password()
      })
      .expect(401)
      .end((err, response) => expect(response.body).to.equal('Unauthorized'));
  });

  it('retrieves logged-in user information', async () => {
    request(app)
      .get('/private/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, response) => {
        const { email } = response.body;

        expect(email).to.be.equal(rightUser.email);
      });
  });
});
