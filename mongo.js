const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Did not give password as an arguement')
    process.exit(1)
}

const password = process.argv[2]
const uri = `mongodb+srv://vuongeugene:${password}@openfullstackcluster.weioub0.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', true)
mongoose.connect(uri)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Phonebook = mongoose.model("Phonebook", phonebookSchema)


if (process.argv.length >= 5) {
    const phonebook = new Phonebook({
        name: process.argv[3],
        number: process.argv[4]
    })
    phonebook.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}
else {
    Phonebook.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })

}






