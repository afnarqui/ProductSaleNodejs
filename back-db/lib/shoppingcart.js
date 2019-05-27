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

  async function findAllExistsShoppingCart (dataProcess) {
    let items = [
      {
       userId: dataProcess.userId,
       idProducto: dataProcess.idProducto,
       cantidadDisponible: dataProcess.cantidadDisponible,
       quantity: dataProcess.quantity 
      }
    ]
    
    let dataCompleta = []
    dataCompleta.push({
      userId: dataProcess.userId,
      idProducto: dataProcess.idProducto,
      cantidadDisponible: dataProcess.cantidadDisponible,
      quantity: dataProcess.quantity,
      price:dataProcess.price,
      totalPrice:dataProcess.totalPrice,
      exist:false,
      queHago:false,message:'Success'
    })
    return  Promise.each(items,  () => {
      return ShoppingCartModel.findAll({
        where: {
          idProducto:dataProcess.idProducto,
          userId:dataProcess.userId
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
        // let idProducto = res.length>0 ? res[0]['idProducto'] : 0
        return ShoppingCartModel.findAll({ where: {} })
        .then((res)=>{
          let quantity = 0
          let price = 0
          let totalPrice = 0
          for (var i = 0; i < res.length; i++) {
            if (res[i]['idProducto'] === dataCompleta[0]['idProducto'] &&
              res[i]['userId'] !== parseInt(dataCompleta[0]['userId'])) {
              quantity+= res[i]['quantity']
              price+=res[i]['price']
            } else {
              if( res[i]['userId'] === parseInt(dataCompleta[0]['userId']) &&
                  res[i]['idProducto'] !== dataCompleta[0]['idProducto']){
                totalPrice+= res[i]['price'] * res[i]['quantity']
              }
            } 
          }
          if (dataCompleta[0]['quantity'] + quantity <= dataCompleta[0]['cantidadDisponible']) {
            dataCompleta[0]['queHago'] = true
            dataCompleta[0]['price'] = price === 0 ? dataCompleta[0]['price'] : price
            dataCompleta[0]['totalPrice'] = totalPrice === 0 ? dataCompleta[0]['price'] * dataCompleta[0]['quantity'] : dataCompleta[0]['price'] * dataCompleta[0]['quantity'] + totalPrice
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
          price:dataCompleta[0]['price'],
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
      let dataCompletaNull = []
      dataCompletaNull.push({
        message: 'warning that the value is not validated'})
      return Promise.resolve(dataCompletaNull);
    }
  })
}
  return {
    findAllShoppingCart,
    findAllExistsShoppingCart,
    findOneShoppingCart
  }
}
