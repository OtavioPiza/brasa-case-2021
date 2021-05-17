/**
 * Extracts the parameters necessary from the .env file
 *
 * @version 2021-05-15
 * @author Otavio Sartorelli de Toledo Piza
 */
const process = require('process')

require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  PORT,
  MONGODB_URI
}
