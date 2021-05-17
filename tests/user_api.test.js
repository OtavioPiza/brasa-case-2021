/**
 * Test suite for user related operations and routes
 *
 * @version 2021-05-15
 * @author Otavio Sartorelli de Toledo Piza
 */
const mongoose = require('mongoose')      // mongoose api for operation on the db
const User = require('../models/user')    // mongoose user model
const helper = require('./test_helper')   // helper functions

const api = require('supertest')(require('../app'))

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

describe('Viewing users', () => {

  /**
   * Test getting all users
   */
  test('getting all users', async () => {
    const result = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toHaveLength(helper.testUsers.length)
  })

  /**
   * Tests getting an valid user
   */
  test('getting valid user', async () => {
    const result = await api
      .get(`/api/users/${helper.testUsers[0].email}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body.email).toEqual(helper.testUsers[0].email)
    expect(result.body.email)
    expect(result.body.first_name)
    expect(result.body.last_name)
    expect(result.body.age)
    expect(result.body.id)
    expect(result.body.password_hash === undefined)
  })

  /**
   * Tests getting an invalid user
   */
  test('getting invalid user', async () => {
    await api
      .get(`/api/users/${helper.testUsers[0].email.concat('invalid')}`)
      .expect(404)
  })
})

describe('Logging in users', () => {

  /**
   * Valid login
   */
  test('valid login', async () => {
    const result = await api
      .post('/api/login')
      .send({
        email: helper.testUsers[0].email,
        password: helper.testUsers[0].password
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body.token !== undefined)
  })

  /**
   * Invalid login
   */
  test('invalid login', async () => {
    const result = await api
      .post('/api/login')
      .send({
        email: helper.testUsers[0].email,
        password: helper.testUsers[0].password.concat('invalid')
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('invalid')
  })
})

describe('Adding users', () => {

  /**
   * Tests the creation of a valid user
   */
  test('creating succeeds with valid new user', async () => {
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

  /**
   * Test the creation of an invalid user
   */
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

describe('Modifying users', () => {

  /**
   * Tests modifying a user with a valid token
   */
  test('modification succeeds with valid token and email', async () => {
    const initialUsers = await helper.usersInDb()
    const userToken = (await helper.doLogin(helper.testUsers[0].email, helper.testUsers[0].password)).token
    const newEmail = 'new_email@email.com'

    const updatedUser = {
      first_name: helper.testUsers[0].first_name,
      last_name: helper.testUsers[0].last_name,
      email: newEmail,
      id: helper.testUsers[0].id,
      password: helper.testUsers[0].password,
      age: helper.testUsers[0].age
    }

    await api
      .put('/api/users')
      .set({ 'Authorization': `bearer ${userToken}` })
      .send(updatedUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const finalUsers = await helper.usersInDb()
    expect(finalUsers).toHaveLength(initialUsers.length)
    expect(finalUsers.filter(user => user.email === newEmail))
  })

  /**
   * Tests modifying a user with a valid token
   */
  test('modification fails with valid token and invalid email', async () => {
    const initialUsers = await helper.usersInDb()
    const userToken = (await helper.doLogin(helper.testUsers[0].email, helper.testUsers[0].password)).token
    const newEmail = helper.testUsers[1].email

    const updatedUser = {
      first_name: helper.testUsers[0].first_name,
      last_name: helper.testUsers[0].last_name,
      email: newEmail,
      id: helper.testUsers[0].id,
      password: helper.testUsers[0].password,
      age: helper.testUsers[0].age
    }

    await api
      .put('/api/users')
      .set({ 'Authorization': `bearer ${userToken}` })
      .send(updatedUser)
      .expect(400)

    const finalUsers = await helper.usersInDb()
    expect(finalUsers).toHaveLength(initialUsers.length)
    expect(!finalUsers.filter(user => user.email === newEmail))
  })

  /**
   * Tests modifying a user with a valid token
   */
  test('modification fails with invalid token and valid email', async () => {
    const initialUsers = await helper.usersInDb()
    const newEmail = helper.testUsers[1].email

    const updatedUser = {
      first_name: helper.testUsers[0].first_name,
      last_name: helper.testUsers[0].last_name,
      email: newEmail,
      id: helper.testUsers[0].id,
      password: helper.testUsers[0].password,
      age: helper.testUsers[0].age
    }

    await api
      .put('/api/users')
      .set({ 'Authorization': 'bearer invalidtoken' })
      .send(updatedUser)
      .expect(401)

    const finalUsers = await helper.usersInDb()
    expect(finalUsers).toHaveLength(initialUsers.length)
    expect(!finalUsers.filter(user => user.email === newEmail))
  })
})

describe('Deleting users', () => {

  /**
   * Tests deleting a user with a valid token
   */
  test('deletion succeeds with valid token', async () => {
    const initialUsers = await helper.usersInDb()
    const userToken = (await helper.doLogin(helper.testUsers[0].email, helper.testUsers[0].password)).token

    await api
      .delete('/api/users')
      .set({ 'Authorization': `bearer ${userToken}` })
      .send({
        id: helper.testUsers[0].id
      })
      .expect(204)

    const finalUsers = await helper.usersInDb()
    expect(finalUsers).toHaveLength(initialUsers.length - 1)
  })

  /**
   * Tests deleting a user with an invalid token
   */
  test('deletion fails with invalid token', async () => {
    const initialUsers = await helper.usersInDb()

    await api
      .delete('/api/users')
      .set({ 'Authorization': 'bearer invalid' })
      .send({
        id: helper.testUsers[0].id
      })
      .expect(401)

    const finalUsers = await helper.usersInDb()
    expect(finalUsers).toHaveLength(initialUsers.length)
  })
})

afterAll(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})