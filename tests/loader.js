/**
 * NodeJS app to load data into the database whose url is passed as an argument
 *
 * @version 2021-05-15
 * @author Otavio Sartorelli de Toledo Piza
 */
const fs = require('fs')
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const process = require('process')

const data = JSON.parse(fs.readFileSync('./data/mock_data.json'))

/**
 * connects to the database passed as an argument
 */
mongoose.connect(process.argv[2], {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    console.log('connected to MongoDB')

    data.map(async (user) => {

      const passwordHash = await bcrypt.hash(user.password, 1)

      const userObject = new User({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password_hash: passwordHash,
        age: user.age
      })
      const savedUser = await userObject.save()
      console.log(savedUser)
    })

    return NaN
  })
  .catch((error) => {
    console.error('error connecting to MongoDB', error.message)
  })
