'use strict'

const chalk = require('chalk')
const debug = require('debug')
const express = require('express')
const asyncify = require('express-asyncify')
const db = require('./index.js')
const config = require('./config/index.js')
const api = asyncify(express.Router())
let services, User, ShoppingCart

api.use('*', async function (req, res, next) {
  console.log('Connecting to database')
  debug(`${chalk.green('Connecting to database')}`)
  if (!services) {
    try {
      console.log('connected')
      services = await db(config.db).catch(handleFatalError)
    } catch (e) {
      console.log('error connecting to database')
      return next(e)
    }

    User = services.User
    ShoppingCart = services.ShoppingCart
  }
  next()
})

api.get('/users', async (req, res, next) => {
  debug('request')
  let users = []
  try {
    console.log(User)
    users = await User.findConnected()
  } catch (e) {
    return next(e)
  }
  res.send({ users })
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

function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

module.exports = api
