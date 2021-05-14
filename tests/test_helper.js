const User = require('../models/user')  // mongoose user model

const api = require('supertest')(require('../app')) // starts the app for testing

/**
 * Test users
 *
 * @type {[{password: string, last_name: string, first_name: string, email: string, age: number}, {password: string, last_name: string, first_name: string, email: string, age: number}, {password: string, last_name: string, first_name: string, email: string, age: number}]}
 */
const testUsers = [
  {
    password: 'password',
    first_name: 'test1',
    last_name: 'test1',
    email: 'test1@email.com',
    age: 1
  },
  {
    password: 'password',
    first_name: 'test2',
    last_name: 'test2',
    email: 'test2@email.com',
    age: 2
  },
  {
    password: 'password',
    first_name: 'test3',
    last_name: 'test3',
    email: 'test3@email.com',
    age: 3
  },
]

/**
 * Gets all the users in the database
 *
 * @returns {Promise<*>}
 */
const usersInDb = async () => {
  return (await User.find({}).map(user => user.toJSON()))
}

const doLogin = async (email, password) => {
  return (
    await api
      .post('/api/login')
      .send({
        email,
        password
      }))
    .body
}

module.exports = {
  testUsers,
  usersInDb,
  doLogin
}