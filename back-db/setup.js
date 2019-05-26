'use strict'
const db = require('./') 

const debug = require('debug')('back-db:db')

async function setup () {
  const config = {
    database: process.env.DB_NAME || 'postgres',
    username: process.env.DB_USER || 'afn',
    password: process.env.DB_PASS || 'afn',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }

  await db(config).catch(handleFatalError)

  console.log('Success!')
  process.exit(0)
}

function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

setup()
