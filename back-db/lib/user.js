'use strict'

module.exports = function setupUser (UserModel) {
  function findAll () {
    return UserModel.findAll()
  }
  function findConnected () {
    return UserModel.findAll({
      where: {
      }
    })
  }
  function findByUuid (uuid) {
    return UserModel.findOne({
      where: {
        uuid
      }
    })
  }
  return {
    findAll,
    findConnected,
    findByUuid
  }
}
