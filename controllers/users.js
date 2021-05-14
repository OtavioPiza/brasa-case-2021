const bcrypt = require('bcrypt')                  // package used to generate the password hashes
const usersRouter = require('express').Router()   // express router
const User = require('../models/user')            // mongoose model
const logger = require('../utils/logger')

/**
 * Page with all the users
 */
usersRouter.get('/', async (request, response) => {
  let users = await User.find({})
  response.json(users)
})

/**
 * Page with a single user's info if one is found
 */
usersRouter.get('/:email', async (request, response) => {
  const users = await User.find({
    email: request.params.email
  })
  if (users) {
    response.json(users[0])

    if (users.length > 1) {
      logger.error(`Found too many users for the same email:\n${users}`)
    }

  } else {
    response.status(404).end()
  }
})

usersRouter.delete('/:email', async (request, response) => {
  await User.findOneAndDelete({ email: request.params.email })
  response.status(204).end()
})

usersRouter.put('/:email', async (request, response) => {
  const body = request.body
  const user = {
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password: body.password,
    age: body.age
  }
  const updatedUser = await User.findOneAndUpdate({ email: body.email }, user, { new: true })
  response.json(updatedUser)
})

/**
 * Registers a new user to the database as long as its email is unique
 */
usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const saltRounds = 8  // ~40 hashes per second
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password_hash: passwordHash,
    age: body.age
  })
  const savedUser = await user.save()
  response.json(savedUser)
})

module.exports = usersRouter