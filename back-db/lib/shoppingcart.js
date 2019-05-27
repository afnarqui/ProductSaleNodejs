'use strict'
const Promise = require("bluebird");
module.exports = function setupShoppingCart (ShoppingCartModel) {
  async function findAllShoppingCart () {
    return ShoppingCartModel.findAll()
  }

  async function findOneShoppingCart (uuid,idProducto) {
    const cond = {
      where: {
        userId: uuid,
        idProducto
      }
    }
    const existingShoppingCart = await ShoppingCartModel.findOne(cond)
  
    if (existingShoppingCart) {
      return existingShoppingCart
    }
    return []
  }

  async function findAllExistsShoppingCart (userId,idProducto,cantidadDisponible,quantity) {
    let items = [
      {userId,idProducto,cantidadDisponible,quantity}
    ]
    let dataCompleta = []
    dataCompleta.push({
      userId,idProducto,
      cantidadDisponible,
      quantity,exist:false,
      queHago:false,message:'Success'
    })
    return  Promise.each(items,  () => {
      return ShoppingCartModel.findAll({
        where: {
          idProducto,
          userId
        }
      })
      .then((res)=>{
          if ( res.length>0) {
            if(res[0]['quantity'] !== undefined && res[0]['quantity']>0) {
              dataCompleta[0]['quantity']+= res[0]['quantity']
              dataCompleta[0]['exist'] = true
            }
          }
          return Promise.resolve(dataCompleta)
      })
      .then((res)=>{
        let idProducto = res.length>0 ? res[0]['idProducto'] : 0
        return ShoppingCartModel.findAll({
          where: {
            idProducto
          }
        })
        .then((res)=>{
          let quantity = 0
          for (var i = 0; i < res.length; i++) {
            if (res[i]['userId'] !== parseInt(dataCompleta[0]['userId'])) {
              quantity+= res[i]['quantity']
            } 
          }
          if (dataCompleta[0]['quantity'] + quantity <= cantidadDisponible) {
            dataCompleta[0]['queHago'] = true
          }else {
            dataCompleta[0]['queHago'] = false
          }
          return Promise.resolve(dataCompleta)
        })
      })
      .catch((err)=>{
          return Promise.reject(err);
      });
  })
  .then( () => {
    let queHago = dataCompleta[0]['queHago']
    if (queHago) {
      const cond = {
        where: {
          userId: dataCompleta[0]['userId'],
          idProducto: dataCompleta[0]['idProducto']
        }
      }
      let dataShoppingCart = {
          idProducto:dataCompleta[0]['idProducto'],
          quantity: dataCompleta[0]['quantity'],
          userId:dataCompleta[0]['userId'],
        }
      if (dataCompleta[0]['exist']){
        return ShoppingCartModel.update(dataShoppingCart, cond)
        .then(() => {
          return Promise.resolve(dataCompleta);    
        })
      } else {
        return ShoppingCartModel.create(dataShoppingCart)
        .then(()=>{
          return Promise.resolve(dataCompleta);
        })
      }
    }else {
      dataCompleta[0]['message'] = 'warning that the value is not validated'
      return Promise.resolve(dataCompleta);
    }
  })
}
  return {
    findAllShoppingCart,
    findAllExistsShoppingCart,
    findOneShoppingCart
  }
}
