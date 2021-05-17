/**
 * Contains the functions for logging server activity
 *
 * @version 2021-05-15
 * @author Otavio Sartorelli de Toledo Piza
 */
const process = require('process')

const info = (...params) => {

  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

module.exports = {
  info,
  error,
}