'use strict'

const chalk = require('chalk')
const debug = require('debug')
const express = require('express')
const asyncify = require('express-asyncify')
const db = require('./index.js')
const config = require('./config/index.js')
const api = asyncify(express.Router())
const auth = require('express-jwt')
const uuid = require('uuid/v1')
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

api.post('/users', auth(config.auth), async (req, res, next) => {
  let Uuid = null
  let state = false
  Uuid = (!req.query.uuid || req.query.uuid === null) ? uuid() : req.query.uuid
  state = (!req.query.state || req.query.state === false) ? true : req.query.state

 const newData = {
   name: req.query.name,
   uuid: Uuid,
   state: state
 }
 let userNew = []
 try {
  userNew = await User.createOrUpdate(newData).catch(handleFatalError)
  res.send({ userNew })
 } catch (e) {
   return next(e)
 }
 next()
});

api.delete('/users', auth(config.auth), async (req, res, next) => {
 if(req.query.uuid === null) {
    return next(new Error('uuid is required'))
  }
  const deleteData = {
   uuid: req.query.uuid
 }
 let userDelete = []
 try {
  userDelete = await User.deleteUser(deleteData).catch(handleFatalError)
  res.send({ userDelete })
 } catch (e) {
   return next(e)
 }
 next()
});

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
