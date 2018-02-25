const request = require('supertest');
const { expect } = require('chai');
const faker = require('faker');
const app = require('../../app');

describe('Todo-related endpoints', () => {
  let rightToken;
  let wrongToken;

  function generateUser(cb) {
    request(app)
      .post('/public/signup')
      .set({
        email: faker.internet.email(),
        password: faker.internet.password()
      })
      .expect(201)
      .end(cb);
  }

  function generateTodos(token, cb) {
    request(app)
      .post('/private/todos')
      .send({ title: faker.lorem.words() })
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .end(cb);
  }

  before(async () => {
    generateUser((err, response) => rightToken = response.body.token);
    generateUser((err, response) => wrongToken = response.body.token)
  });

  it('should create a new todo', async () => {
    generateTodos(rightToken, (err, response) => {
      const todo = response.body;

      expect(todo.status).to.be.equal('todo');
    });
  });

  it('should retrieve the todo if it belongs to the user', async () => {
    generateTodos(rightToken, (err, response) => {
      const todo = response.body;

      request(app)
        .get(`/private/todos/${todo._id}`)
        .set('Authorization', `Bearer ${rightToken}`)
        .expect(200)
        .end((err, response) => expect(response.body).to.eql(todo));

      request(app)
        .get(`/private/todos/${todo._id}`)
        .set('Authorization', `Bearer ${wrongToken}`)
        .expect(401)
        .end((err, response) => expect(response.body).to.equal('Unauthorized'));
    });
  });

  it('should only list todos belonging to the logged-in user', async () => {
    generateTodos(rightToken, (err, response) => {
      const todoRightToken = response.body;

      generateTodos(wrongToken, (err, response) => {
        const todoWrongToken = response.body;

        request(app)
          .get('/private/todos')
          .set('Authorization', `Bearer ${rightToken}`)
          .expect(200)
          .end((err, response) => {
            expect(response.body).to.include(todoRightToken);
            expect(response.body).to.not.include(todoWrongToken);
          });
      });
    });
  });

  it('should update the todo if it belongs to the user', async () => {
    generateTodos(rightToken, (err, response) => {
      const todo = response.body;
      request(app)
        .put(`/private/todos/${todo._id}`)
        .send({ status: 'doing' })
        .set('Authorization', `Bearer ${rightToken}`)
        .expect(200)
        .end((err, response) => expect(response.body.status).to.equal('doing'));

      request(app)
        .put(`/private/todos/${todo._id}`)
        .send({ status: 'doing' })
        .set('Authorization', `Bearer ${wrongToken}`)
        .expect(401)
        .end((err, response) => expect(response.body).to.equal('Unauthorized'));
    });
  });

  it('should delete the todo if it belongs to the user', async () => {
    generateTodos(rightToken, (err, response) => {
      const todo = response.body;
      request(app)
        .delete(`/private/todos/${todo._id}`)
        .set('Authorization', `Bearer ${rightToken}`)
        .expect(200)
        .end((err, response) => expect(response.body.success).to.be.true);
    });

    generateTodos(rightToken, (err, response) => {
      const todo = response.body;

      request(app)
        .delete(`/private/todos/${todo._id}`)
        .set('Authorization', `Bearer ${wrongToken}`)
        .expect(401)
        .end((err, response) => expect(response.body).to.equal('Unauthorized'));
    });
  })
});
