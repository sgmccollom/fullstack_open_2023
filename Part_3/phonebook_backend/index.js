require('dotenv').config();

const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const Contact = require('./models/contact');

morgan.token('bodyContent', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  } else {
    return '';
  }
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(404).send({ error: 'malformed id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyContent'));
app.use(express.static('build'));

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/info', (request, response) => {
  Contact.find({}).then(contacts => {
    let total = contacts.length;
    let date = new Date();
    response.send(`<p>Phonebook has info for ${total} people</p><p>${date.toString()}</p>`);
  });
});

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts);
  });
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  const person = new Contact({
    name: body.name,
    number: body.number,
  });

  person.save().then(savedPerson => {
    response.json(savedPerson);
  })
    .catch(error => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  Contact.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedContact => {
      response.json(updatedContact);
    })
    .catch(error => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
