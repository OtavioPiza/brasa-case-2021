const cors = require('cors')

const mongoose = require('mongoose')
const express = require('express')
const app = express()

const config = require('./utils/config')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

logger.info(`connecting to ${config.MONGODB_URI}`)

mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        logger.info('connect to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB', error.message)
    })

app.use(cors)

app.use(express.json)

app.use(middleware.requestLogger)

app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler)

module.exports = app