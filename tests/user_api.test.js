const mongoose = require('mongoose')      // mongoose api for operation on the db
const User = require('../models/user')    // mongoose user model
const helper = require('./test_helper')   // helper functions

const api = require('supertest')(require('../app'))

describe('Three initial users in the database', () => {

  /**
   * Prepares the db for testing
   */
  beforeEach(async () => {
    await User.deleteMany({})
    const userObjects = helper.testUsers.map(user => {
      return new User({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password_hash: user.password_hash,
        age: user.age
      })
    })
    await Promise.all(userObjects.map(user => user.save()))
  })

  /**
   * Tests the creation of a valid user
   */
  test('valid new user', async () => {
    const initialUsers = await helper.usersInDb()
    const newUser = {
      password: 'password',
      first_name: 'new',
      last_name: 'new',
      email: 'new@email.com',
      age: 1
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const finalUsers = await helper.usersInDb()
    const emails = finalUsers.map(user => user.email)
    expect(finalUsers).toHaveLength(initialUsers.length + 1)
    expect(emails).toContain('new@email.com')
  })

  test('creation fails with a duplicated email', async () => {
    const initialUsers = await helper.usersInDb()

    const newUser = {
      email: helper.testUsers[0].email,
      password: helper.testUsers[0].password,
      first_name: 'fail',
      last_name: 'fail',
      age: -1
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const finalUsers = await helper.usersInDb()

    expect(result.body.error).toContain('`email` to be unique')
    expect(finalUsers).toHaveLength(initialUsers.length)
  })
})

afterAll(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})