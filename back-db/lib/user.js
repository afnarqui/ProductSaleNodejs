'use strict'

module.exports = function setupUser (UserModel) {
  function findAll () {
    return UserModel.findAll()
  }
  function findConnected () {
    return UserModel.findAll({
      where: {
        state: true
      }
    })
  }
  return {
    findAll,
    findConnected
  }
}
