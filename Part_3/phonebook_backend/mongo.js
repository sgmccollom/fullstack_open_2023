const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://sgmcm-fullstack:${password}@cluster0.tvfzl43.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(contact.name)
    })
    mongoose.connection.close()
  })
} else {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  })

  contact.save().then(result => {
    // console.log()
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}

