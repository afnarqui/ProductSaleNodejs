'use strict'

module.exports = function setupUser (UserModel) {
  async function createOrUpdate (user) {
    const cond = {
      where: {
        uuid: user.uuid
      }
    }

    const existingUser = await UserModel.findOne(cond)

    if (existingUser) {
      const updated = await UserModel.update(user, cond)
      return updated ? UserModel.findOne(cond) : existingUser
    }

    const result = await UserModel.create(user)
    return result.toJSON()
  }

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
    findByUuid,
    createOrUpdate
  }
}
