const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    username : String ,
    email : String ,
    password : String ,
    image : { type : String , default : 'default-pic.jpg' } ,
    status : { type : Boolean , default : false } , 
    friends : [{ id : String , name : String , image : String , dateOfJoin : Date , chatId : String}] ,
    friendRequests : [{ id : String }] ,
    sentRequests : [{ id : String }] ,
    notifications : [{ id : String , name : String , image : String , typeOfNotification : String }] ,
    dateOfJoin : { type : Date , default : Date.now } 
})

const user = mongoose.model('user', userSchema)

module.exports = user ;