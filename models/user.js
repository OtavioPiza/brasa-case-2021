const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log(`connecting to ${url}`)

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true

}).then(() => {
    console.log('connected to MongoDB')

}).catch((error) => {
    console.log(`error connecting to MongoDB: ${error.message}`)

})

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