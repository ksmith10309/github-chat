import request from 'supertest';
const {app} = require('../src/app.js');

describe('GET /', () => {
  it('should respond with login page', (done) => {
    request(app)
      .get('/')
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.text).toMatch(/Login With GitHub/);
        done();
      });
  });
});

describe('GET /test', () => {
  it('should respond with 404 Not Found', (done) => {
    request(app)
      .get('/test')
      .then(res => {
        expect(res.statusCode).toBe(404);
        expect(res.text).toMatch(/404 Not Found/);
        done();
      });
  });
});
