/**
 * Mongoose model representing a user in the database
 *
 * @version 2021-05-15
 * @author Otavio Sartorelli de Toledo Piza
 */
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

/**
 * User schema
 */
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password_hash: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  }
})

userSchema.plugin(uniqueValidator)  // ensures emails have to be unique

/**
 * overrides toJSON property for security
 */
userSchema.set('toJSON', {
  transform: (document, object) => {
    object.id = object._id.toString()
    delete object.password_hash
    delete object._id
    delete object.__v
  }
})

module.exports = mongoose.model('User', userSchema)