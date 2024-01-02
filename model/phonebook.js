const mongoose = require('mongoose')

mongoose.set('strictQuery', true)
console.log('Connecting to MONGODB')
mongoose.connect(process.env.MONGODB_URI)
  .then(result => {
    console.log('Connected')
  })
  .catch(error => {
    console.log('Error:', error)
  })



const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  },
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = new mongoose.model('Phonebook', phonebookSchema)