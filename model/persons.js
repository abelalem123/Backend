const mongoose=require('mongoose')
const url=process.env.MONGODB_URI

mongoose.connect(url).then((res)=>{
    console.log('connected to MongoDB');
}).catch((error)=>{
console.log('error connecting',error.message);
})
const personSchema = new mongoose.Schema({
    name: {
      type:String,
      required:true,
      minLength:3
    },
    number: {
      type:String,
      required:[true,'user phone number required'],
      minLength:8,
      validate:{
        validator:(v)=>{
          return/\d{3}-\d{5}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
  })
  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  module.exports = mongoose.model('Person', personSchema)
