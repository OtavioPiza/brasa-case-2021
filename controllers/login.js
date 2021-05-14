const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

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
        .send({ token, email: user.email, firstName: user.first_name, lastName: user.last_name })
})

module.exports = loginRouter