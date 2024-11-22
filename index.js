require('dotenv').config()
const express = require("express")
const morgan = require("morgan")
const cors = require('cors')
const Person = require('./models/Person')

const app = express()

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())
app.use(express.static('dist'))

const requestDate = new Date()

app.get("/", (request, response) => {
    response.send('<h1>Welcome to phonebook!</h1>')
})

app.get("/info", (request,response) => {
    Person.countDocuments({}).then(count => {
        response.send(`<p>Phonebook has info for ${count} people</p> <p>${requestDate}</p>`)
    })
})

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person){
            response.json(person)
        }
        else {
            response.status(404).send()
        }
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(deletedPerson => { 
        response.json(deletedPerson)
        response.status(204).end()
    })
  })

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number){
        response.status(404).json({
            error: "empty"
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})