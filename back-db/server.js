'use strict'
const debug = require('debug')
const http = require('http')
const chalk = require('chalk')
const express = require('express')
const asyncify = require('express-asyncify')
const api = require('./api')
const config = require('./config')

const port = process.env.PORT || config.port
const app = asyncify(express())
const server = http.createServer(app)

app.use('/api', api)

// Express errors
app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`)

  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message })
  }

  res.status(500).send({ error: err.message })
})

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

if (!module.parent) {
  process.on('uncaughtException', handleFatalError)
  process.on('unhandledRejection', handleFatalError)

  server.listen(port, () => {
    console.log(`${chalk.green('[server listening on port: ]')} ${port}`)
  })
}

module.exports = server
