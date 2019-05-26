'use strict'

const setupDatabase = require('./lib/db')
const setupUserModel = require('./models/user')
const setupShoppingCart = require('./models/shoppingcart')
const setupUser = require('./lib/user')
const defaults = require('defaults')

module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  })
  const sequelize = setupDatabase(config)
  const UserModel = setupUserModel(config)
  const ShoppingCartModel = setupShoppingCart(config)

  UserModel.hasMany(ShoppingCartModel)
  ShoppingCartModel.belongsTo(UserModel)

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true })
  }

  const User = setupUser(UserModel)
  const ShoppingCart = {}

  return {
    User,
    ShoppingCart
  }
}
