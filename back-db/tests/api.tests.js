'use strict'

const test = require('ava')
const request = require('supertest')
const server = require('../server')

test.serial.cb('/api/shoppingcarts', t => {
  
  request(server)
    .get('/api/shoppingcarts')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      let body = res.body
      t.deepEqual(body, [], 'response body should be the expected')
      t.end()
    })
})

test('aja', t => {
  t.pass()
})
