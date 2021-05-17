/**
 * FIle with the middleware for the server
 *
 * @version 2021-05-15
 * @author Otavio Sartorelli de Toledo Piza
 */
const logger = require('./logger')

/**
 * Logs the requests sent to the server
 */
const requestLogger = (request, response, next) => {
  logger.info(`Method:\t${request.method}`)
  logger.info(`Path:\t${request.path}`)
  logger.info(`Body:\t${JSON.stringify(request.body)}`)
  logger.info('---')
  next()
}

/**
 * Sends a 404 response if the request if for a non-existing page
 */
const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
}

/**
 * Handles errors from the server
 */
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformed request'
    })
  }
  else if(error.name === 'ValidationError' || error.name === 'MongoError') {
    return response.status(400).json({
      error: error.message
    })
  }
  else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }
  logger.error(error.message)
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}