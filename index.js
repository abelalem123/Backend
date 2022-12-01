const{request,response}=require('express')
require('dotenv').config()
const Person=require('./model/persons')
const express=require('express')
var morgan=require('morgan')
const app=express();
app.use(express.json())
app.use(express.static('build'))
morgan.token('body', function (req, res) { 
 
  return   JSON.stringify(req.body)})
app.use( morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler=(error,request,response,next)=>{
console.log(error);
if (error.name === 'CastError') {
  return response.status(400).send({ error: 'malformatted id' })
} 
next(error)
}


let persons=[
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]
app.get('/api/persons',(request,response)=>{
 Person.find({}).then((persons)=>{
  response.json(persons)
 })
  
})

app.get('/api/info',(request,response)=>{
  console.log(new Date());
const obj={
  title:`Phonebook has info for ${persons.length} peoples`,

  len:new Date()
}
  response.send(obj.title+ ' \n'+obj.len)
})
app.get('/api/persons/:id',(request,response)=>{
  const id=Number(request.params.id)
  console.log(id);
  const person=persons.find((pers)=>pers.id===id)
  if(!person){
    response.status(404).end()
  }
  response.json(person)
})
app.delete('/api/persons/:id',(request,response)=>{
  Person.findByIdAndRemove(request.params.id).then((result)=>response.status(204).end())
  
  
})
app.post('/api/persons',(request,response)=>{
const body=request.body
const maxId=Math.max(...persons.map((person)=>person.id))
const duplicate=persons.find((pers)=>pers.name.toUpperCase()===body.name.toUpperCase())
if(!body.number||!body.name){
return response.status(404).json({
  error:"name or number is missing"
})
}
// else if(duplicate){
// response.status(409).end()
// }

const person=new Person({
  
  name:body.name,
  number:body.number
})
person.save().then((savedPerson)=>{
  response.json(savedPerson)
})
})
app.put('/api/persons/:id',(request,response)=>{
  const body=request.body
  Person.findByIdAndUpdate(request.params.id,{"number":body.number},).then(updatePerson=>response.json(updatePerson)).catch(error=>next(error))
})
const port=process.env.PORT
app.listen(port,()=>console.log(`server is running on port ${port}`))