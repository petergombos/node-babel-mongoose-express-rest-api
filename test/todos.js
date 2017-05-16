import request from 'supertest-as-promised'
import { expect } from 'chai'

import app from '../src/'

const todo = {
  title: 'Buy milk',
  done: false
}

describe('Todos Endpoint', () => {
  it('should create a todo', done => {
    request(app)
      .post('/todos')
      .send(todo)
      .expect(200)
      .then(res => {
        todo._id = res.body._id
        expect(res.body._id).to.be.a('string')
        expect(res.body.title).to.equal(todo.title)
        expect(res.body.done).to.equal(todo.done)
        done()
      })
      .catch(done)
  })
  it('should get a todo by id', done => {
    request(app)
      .get('/todos/' + todo._id)
      .expect(200)
      .then(res => {
        expect(res.body._id).to.be.a('string')
        expect(res.body.title).to.equal(todo.title)
        expect(res.body.done).to.equal(todo.done)
        done()
      })
      .catch(done)
  })
  it('should list all todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .then(res => {
        expect(res.body[0]._id).to.be.a('string')
        expect(res.body[0].title).to.equal(todo.title)
        expect(res.body[0].done).to.equal(todo.done)
        done()
      })
      .catch(done)
  })
  it('should update a todo', done => {
    request(app)
      .put('/todos/' + todo._id)
      .send({
        done: true
      })
      .expect(200)
      .then(res => {
        expect(res.body.done).to.equal(true)
        done()
      })
      .catch(done)
  })
  it('should delete a todo', done => {
    request(app)
      .delete('/todos/' + todo._id)
      .expect(200)
      .then(() => {
        done()
      })
      .catch(done)
  })
  it('should not be able to find deleted todo', done => {
    request(app)
      .delete('/todos/' + todo._id)
      .expect(404)
      .then(() => {
        done()
      })
      .catch(done)
  })
})
