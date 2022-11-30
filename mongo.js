const mongoose = require('mongoose')

if (process.argv.length < 5) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name= process.argv[3]
const number=process.argv[4]
const url = `mongodb+srv://abel:${password}@cluster0.6a0hpkr.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')

    const person = new Person({
      name:name,
      number: number,
    })

    return person.save()
  })
  .then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))