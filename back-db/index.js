'use strict'

const setupDatabase = require('./lib/db') 
const setupUserModel = require('./models/user')
const setupShoppingCart = require('./models/shoppingcart')

module.exports = async function (config) {
  const sequelize = setupDatabase(config)
  const UserModel = setupUserModel(config)
  const ShoppingCartModel = setupShoppingCart(config)

  UserModel.hasMany(ShoppingCartModel)
  ShoppingCartModel.belongsTo(UserModel)

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true })
  }

  const User = {}
  const ShoppingCart = {}

  return {
    User,
    ShoppingCart
  }
}