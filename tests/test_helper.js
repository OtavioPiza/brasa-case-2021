/**
 * Helper functions for the test suites
 *
 * @version 2021-05-15
 * @author Otavio Sartorelli de Toledo Piza
 */
const User = require('../models/user')  // mongoose user model

const api = require('supertest')(require('../app')) // starts the app for testing

/**
 * Test users
 */
const testUsers = [
  {
    password: 'password',
    password_hash: '$2b$04$ROQxdkGUxASuDjNWvBQTbe3Lx2bMOzE64Ky6ijfTx4qo8Cmqyj8pq',
    first_name: 'test1',
    last_name: 'test1',
    email: 'test1@email.com',
    age: 1
  },
  {
    password: 'password',
    password_hash: '$2b$04$GQlGtiF7P5o.4csLRAWbDOf96qSP4Dz4VVWaUPHP2RXoEnYZO.QkW',
    first_name: 'test2',
    last_name: 'test2',
    email: 'test2@email.com',
    age: 2
  },
  {
    password: 'password',
    password_hash: '$2b$04$4sL/eafNHvrzKWIfxOVKaeM9Uwaxe4JujMjyHT8gJONn.ffNTnqUi',
    first_name: 'test3',
    last_name: 'test3',
    email: 'test3@email.com',
    age: 3
  },
]

/**
 * Gets all the users in the database
 *
 * @returns {Promise<*>} users in the database
 */
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

/**
 * Logs a user in returning the body of the server's response
 *
 * @param email email of the user
 * @param password password of the user
 * @returns {Promise<*>} body of the server's response
 */
const doLogin = async (email, password) => {
  return (
    await api
      .post('/api/login')
      .send({
        email: email,
        password: password,
      }))
    .body
}

module.exports = {
  testUsers,
  usersInDb,
  doLogin
}