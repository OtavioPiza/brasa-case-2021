const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', (request, response) => {
  User.find({}).then(users => {
    response.json(users)
  })
})

usersRouter.get('/:email', (request, response) => {
  User.find({
    email: request.params.email
  }).then(users => {

    if (users) {
      response.json(users)

    } else {
      response.status(404).end()
    }
  }).catch(() => {
    response.status(500).end()
  })
})

usersRouter.delete('/:email', (request, response, next) => {
  User.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

usersRouter.put('/:email', (request, response, next) => {
  const body = request.body

  const user = {
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password: body.password,
    age: body.age
  }

  User.findOneAndUpdate({ email: body.email }, user, { new: true})
    .then(updatedUser => {
      response.json(updatedUser)
    })
    .catch(error => next(error))
})

usersRouter.post('/', (request, response, next) => {
  const body = request.body

  if (!body) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const user = new User({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password: body.password,
    age: body.age
  })
  user.save()
    .then(() => {
      response.json(user)
    })
    .catch(error => next(error))
})

module.exports = usersRouter