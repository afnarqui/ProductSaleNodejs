'use strict'

const debug = require('debug')('back-api:routes')
const express = require('express')
const asyncify = require('express-asyncify')
const db = require('./lib/db')

const config = require('./config')

const api = asyncify(express.Router())

let services, User, ShoppingCart

api.use('*', async (req, res, next) => {
  if (!services) {
    services = await db(config.db)
  }
})

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
