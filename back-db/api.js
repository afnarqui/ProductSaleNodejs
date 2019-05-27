'use strict'

const chalk = require('chalk')
const debug = require('debug')
const express = require('express')
const asyncify = require('express-asyncify')
const db = require('./index.js')
const config = require('./config/index.js')
const api = asyncify(express.Router())
const auth = require('express-jwt')
let services, User, shoppingCart

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
    shoppingCart = services.ShoppingCart
  }
  next()
})

api.get('/users', auth(config.auth), async (req, res, next) => {
  debug('request')

  const { user } = req 
  console.log(user)
  // if( !user || user.username) {
  //   return next(new Error('Not authorized'))
  // }
  
  let users = []
  try {
    console.log(User)
    users = await User.findConnected()
  } catch (e) {
    return next(e)
  }
  res.send({ users })
})

api.get('/users/:uuid', async (req, res, next) => {
  const { uuid } = req.params

  let users
  try {
    users = await User.findByUuid(uuid)
  } catch (e) {
    return next(e)
  }

  if (!users) {
    return next(new Error(`users not found with uuid ${uuid}`))
  }
  res.send({ users })
})

api.get('/shoppingcarts', async (req, res, next) => {
  let shoppingcart = []
  try {
    shoppingcart = await shoppingCart.findAllShoppingCart()
  } catch (e) {
    return next(e)
  }
  res.send({ shoppingcart })
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
