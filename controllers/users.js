const bcrypt = require('bcrypt')                  // package used to generate the password hashes
const process = require('process')                // process
const jwt = require('jsonwebtoken')               // json web token
const usersRouter = require('express').Router()   // express router
const User = require('../models/user')            // mongoose model
const logger = require('../utils/logger')         // logger util

// == Authorization ================================================================================================= //

const saltRounds = 8  // ~40 hashes per second

const getTokenFrom = request => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

// == Routes ======================================================================================================== //

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
  if (users.length > 0) {
    response.json(users[0])

    if (users.length > 1) {
      logger.error(`Found too many users for the same email:\n${users}`)
    }

  } else {
    response.status(404).end()
  }
})

/**
 * Deletes a user if they are signed in
 */
usersRouter.delete('/', async (request, response) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id === request.body.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }
  await User.findByIdAndDelete(decodedToken.id)
  response.status(204).end()
})

/**
 * Updates a user's info if they are signed in
 */
usersRouter.put('/', async (request, response) => {
  const body = request.body

  if (!body) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)


  if (!token || !decodedToken.id === body.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = {
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password_hash: passwordHash,
    age: body.age
  }
  const updatedUser = (await User.findByIdAndUpdate(decodedToken.id, user, {new: true})).toJSON()
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