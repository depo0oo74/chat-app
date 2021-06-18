const mongoose = require('mongoose')


const chatSchema = mongoose.Schema({
    users : [
        {id : String, name : String, image:String}, 
        {id : String, name : String, image:String}
    ] ,
    messages : [{
        content : String ,
        date : {type : Date , default : Date.now} ,
        authorId : String
    }]
})
const chat = mongoose.model('chat', chatSchema)


module.exports = chat ;
