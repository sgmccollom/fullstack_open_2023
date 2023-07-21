import { useState, useEffect } from 'react'

import personService from './services/persons'

const Filter = (props) => {
  return (
    <div>
      filter shown with <input value={props.newMatch} onChange={props.handleFilterChange}/>
    </div>
  )
}

const Notification = ({ message,forClass }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={forClass ? 'error' : 'success'}>
      {message}
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <>
      <form onSubmit={props.addPerson}>
        <div>
          name: <input value={props.newName} onChange={props.handleNameChange}/>
        </div>
        <div>
          number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}

const Persons = ({ persons,handleDelete }) => {
  return (
    <>
      {persons.map(person =>
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id)}>
            delete
          </button>
        </p>
      )}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newMatch, setMatched] = useState([])
  const [actionMessage, setActionMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const removePersonWith = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(id)
        .then(response => {
          setPersons(persons.filter(p => p.id !== id))
      })
    }
  }

  const personsToShow = persons.filter(person => {
    let regex = new RegExp(`^${newMatch}`, 'i')
    return person.name.match(regex)
  })

  const addPerson = (event) => {
    event.preventDefault()
    let names = persons.map(person => person.name)

    if (names.includes(newName)) {
      window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      const person = persons.find(p => p.name === newName)
      const changedPerson = { ...person, number: newNumber }

      personService
        .update(person.id, changedPerson)
        .then(returnedPerson => {
          setIsError(false)
          setActionMessage(
            `${newName} was successfully updated!`
          )
          setTimeout(() => {
            setActionMessage(null)
          }, 5000)
          setPersons(persons.map(p => p.name !== newName ? p : returnedPerson))
      })
        .catch(error => {
          setIsError(true)
          setActionMessage(error.response.data.error)
          console.log(error.response.data.error)
          setTimeout(() => {
            setActionMessage(null)
          }, 5000)
        })

      setNewName('')
      setNewNumber('')
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
        id: persons.length + 1,
      }

      personService
        .create(personObject)
        .then(returnedPerson => {
          setIsError(false)
          setActionMessage(
            `${newName} was successfully added!`
          )
          setTimeout(() => {
            setActionMessage(null)
          }, 5000)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log(error.response.data.error)
          setIsError(true)
          setActionMessage(error.response.data.error)
          setTimeout(() => {
            setActionMessage(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setMatched(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={actionMessage} forClass={isError}/>
      <Filter 
        newMatch={newMatch} 
        handleFilterChange={handleFilterChange}
      />
      <h2>Add a new</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} handleDelete={removePersonWith}/>
    </div>
  )
}

export default App