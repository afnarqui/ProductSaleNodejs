'use strict'

module.exports = function setupShoppingCart (ShoppingCartModel) {
  function findAllShoppingCart () {
    return ShoppingCartModel.findAll()
  }

  return {
    findAllShoppingCart
  }
}
