const mongoose = require('mongoose')

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
    required: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  }
})

userSchema.set('toJSON', {
  transform: (document, object) => {
    object.id = object._id.toString()
    delete object.password
    delete object._id
    delete object.__v
  }
})

module.exports = mongoose.model('User', userSchema)