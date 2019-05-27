'use strict'

module.exports = function setupUser (UserModel) {
 /**
 * logic for create or update user 
 */
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
  /**
 * logic for delete user 
 */
  async function deleteUser (user) {
    
    if (!user.uuid) {
        return {msg: 'No uuid specified..'};
    }

    return !!await UserModel.destroy({
        where: {
            uuid: user.uuid
        }
    });
}
  /**
 * logic for search user all
 */
  function findAll () {
    return UserModel.findAll()
  }
  function findConnected () {
    return UserModel.findAll({
      where: {
      }
    })
  }
  /**
 * logic for search user with uuid
 */
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
    createOrUpdate,
    deleteUser
  }
}
