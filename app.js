require('express-async-errors')   // used to handle exceptions by automatically calling next

const cors = require('cors')  // used for cross-origin requests

const config = require('./utils/config')            // loads the config for the server (create a .env)
const usersRouter = require('./controllers/users')  // routes related to user operation
const middleware = require('./utils/middleware')    // middlewares used by the application
const logger = require('./utils/logger')            // logger used by the application

const mongoose = require('mongoose')  // high level package for operation on MongoDB
const express = require('express')    // express server
const app = express()

// == Connecting to the database ==================================================================================== //

logger.info(`connecting to ${config.MONGODB_URI}`)

/**
 * connects to the database specified by config
 */
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB', error.message)
  })

// == Express server ================================================================================================ //

/**
 * Adds support for cross origin requests
 */
app.use(cors())

/**
 * JSON parser
 */
app.use(express.json())

/**
 * Logs requests sent to the server
 */
app.use(middleware.requestLogger)

/**
 * Routes related to user
 */
app.use('/api/users', usersRouter)

/**
 * Handles unknown endpoints
 */
app.use(middleware.unknownEndpoint)

/**
 * handles errors
 */
app.use(middleware.errorHandler)

module.exports = app