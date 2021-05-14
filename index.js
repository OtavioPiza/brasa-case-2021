const http = require('http')    // used to create the web-server

const app = require('./app')              // express application
const config = require('./utils/config')  // used to get the port for the server
const logger = require('./utils/logger')  // logs the server status

/**
 * Creates the web server
 */
http.createServer(app).listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
