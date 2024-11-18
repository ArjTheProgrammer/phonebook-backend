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
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${requestDate}</p>`)
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
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number){
        response.status(404).json({
            error: "empty"
        })
    }

    if (persons.some(person => person.name === body.name)){
        response.status(404).json({
            error: "name must be unique"
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})