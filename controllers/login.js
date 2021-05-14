const jwt = require('jsonwebtoken')               // json web token
const loginRouter = require('express').Router()   // express router for this app
const User = require('../models/user')            // User mongoose model
const bcrypt = require('bcrypt')                  // used to verify passwords
const process = require('process')                // process

/**
 * Allows a user to login return a token if the authentication is successful
 */
loginRouter.post('/', async (request, response) => {
  const body = request.body
  const user = await User.findOne({ email: body.email })
  const validPassword = user === null
    ? false                                                     // if no user if found we don't waste time
    : await bcrypt.compare(body.password, user.passwordHash)    // checks with the hash

  if (!user || !validPassword) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }
  const userForToken = {
    email: user.email,
    id: user._id
  }
  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, email: user.email, first_name: user.first_name, last_name: user.last_name })
})

module.exports = loginRouter