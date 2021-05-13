const logger = require('logger')

const requestLogger = (request, response, next) => {
    logger.info(`Method:\t${request.method}`)
    logger.info(`Path:\t${request.path}`)
    logger.info(`Body:\t${JSON.stringify(request.body)}`)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformed request'
        })
    }
    else if(error.name === 'ValidationError') {
        return response.status(400).json({
            error: error.message
        })
    }
    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}