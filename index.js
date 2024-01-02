require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Phonebook = require('./model/phonebook')


app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

const customMorgan = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
})

app.use(customMorgan)

const errorHandler = (error, request, response, next) => {
  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malfomatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}


let persons = [
]

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const phonebook = {
    name: body.name,
    number: body.number
  }

  Phonebook.findByIdAndUpdate(request.params.id, phonebook, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Phonebook.find({})
    .then(result => {
      response.json(result)
    })
})

app.get('/info', (request, response) => {
  Phonebook.find({})
    .then(result => {
      const length = result.length
      response.send(`<p>Phonebook has info for ${length} people</p><p>${new Date(Date.now())}</p>`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body



  //Check if name is already in list
  const nameExist = persons.find(p => p.name === body.name)
  if (nameExist) {
    return response.status(404).json({
      error: 'name must be unique'
    })
  }




  const person = new Phonebook({
    'name': body.name,
    'number': body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))

})

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`)
})