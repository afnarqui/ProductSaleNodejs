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
var Request = require("request");
/**
 * middleware connectiong database
 */
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

/**
 * crud user get all 
 */
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

/**
 * crud user get for uuid 
 */
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

/**
 * crud user post add or update
 */
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
})

/**
 * crud user delete
 */
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
})

/**
 * crud shoppingcarts all
 */
api.get('/shoppingcarts', async (req, res, next) => {
  let shoppingcart = []
  try {
    shoppingcart = await shoppingCart.findAllShoppingCart()
  } catch (e) {
    return next(e)
  }
  res.send({ shoppingcart })
})

/**
 * crud shoppingcarts for userId
 */
api.get('/shoppingcarts/:userId', auth(config.auth), async (req, res) => {
  const { userId } = req.params
  let shoppingcart = []
  try {
    shoppingcart = await shoppingCart.findByUserId(userId)
  } catch (e) {
    return next(e)
  }
  res.send({ shoppingcart })
})

/**
 * crud shoppingcarts for userId nad idProducto
 */
api.get('/shoppingcarts/:userId/:idProducto', auth(config.auth), async (req, res) => {
  const { userId , idProducto } = req.params
  let shoppingcart = []
  try {
    shoppingcart = await shoppingCart.findByUserIdProductId(userId,idProducto)
  } catch (e) {
    return next(e)
  }
  res.send({ shoppingcart })
})

/**
 * crud shoppingcarts post add or update
 * userId = uuid entity users field uuid
 * idProducto = idProducto of the api https://fvwzxk56cg.execute-api.us-east-1.amazonaws.com/mock/productos/1
 */
api.post('/shoppingcarts', auth(config.auth), async (req, res, next) => {
  
  if(req.query.userId === undefined || req.query.userId === null ||
     req.query.idProducto === undefined || req.query.idProducto === null
     || req.query.quantity === undefined || req.query.quantity === null || parseInt(req.query.quantity) <= 0 ) {
    return next(new Error('the field quantity and idProducto and uuid is required'))
  }
  let userId = req.query.userId
  let quantityUser = 0
  let id = parseInt(req.query.idProducto)
  let api = config.apiProduct
  quantityUser = parseInt(req.query.quantity)

  api = api.replace('afn:afn',id)
  
  let dataProduct = []
  let value = []
  return Request.get(api, async (error, response, body, next) => {
    if(error) {
        return next(error);
    }
    dataProduct = JSON.parse(body)
    let price = dataProduct.precio
    let cantidadDisponible = dataProduct.cantidadDisponible
    let idProducto = dataProduct.idProducto
    let quantity = quantityUser === undefined ? 0 : quantityUser
    try {
      let dataProcess = {
      userId: userId,
      idProducto: idProducto,
      cantidadDisponible:cantidadDisponible,
      quantity: quantity,
      price:price,
      totalPrice:0
    }
      value = await shoppingCart.findAllExistsShoppingCart(dataProcess)
      return res.send(value)
    } catch (e) {
      return next(e)
    }
  })
  
})

/**
 * crud shoppingcarts delete
 */
api.delete('/shoppingcarts', auth(config.auth), async (req, res, next) => {
  if(req.query.id === null) {
     return next(new Error('id is required'))
   }
   const deleteData = {
    id: req.query.id
  }
  let shoppingcartsDelete = []
  try {
    shoppingcartsDelete = await shoppingCart.deleteShoppingCart(deleteData).catch(handleFatalError)
   res.send({ shoppingcartsDelete })
  } catch (e) {
    return next(e)
  }
  next()
 })

/**
 * return Fatal error
 */
function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

module.exports = api
