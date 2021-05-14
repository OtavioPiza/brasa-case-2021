const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.get('/:email', async (request, response) => {
  const users = await User.find({
    email: request.params.email
  })
  if (users) {
    response.json(users)

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

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const saltRounds = 8
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