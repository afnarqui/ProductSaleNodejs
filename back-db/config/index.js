'use strict'

const debug = require('debug')

module.exports = {
  db: {
    database: process.env.DB_NAME || 'postgres',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s)
  },
  auth: {
    secret: process.env.SECRET || 'afn'
  },
  port: 8004,
  apiProduct: 'https://fvwzxk56cg.execute-api.us-east-1.amazonaws.com/mock/productos/afn:afn'
}
