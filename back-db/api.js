'use strict'

const debug = require('debug')('back-api:routes')
const express = require('express')

const api = express.Router()

api.get('/users', (req, res) => {
  debug('request')
  res.send({})
})

api.get('/users/:uuid', (req, res, next) => {
  const { uuid } = req.params

  if (uuid !== 'yyy') {
    return next(new Error('users not found'))
  }
  res.send({ uuid })
})

api.get('/shoppingcarts', (req, res) => {
  res.send({})
})

api.get('/shoppingcarts/:id', (req, res) => {
  const { id } = req.params
  res.send({ id })
})

module.exports = api
