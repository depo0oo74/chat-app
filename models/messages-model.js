const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    authorName : String ,
    authorImage : String ,
    content : String ,
    date : { type : Date , default : Date.now } ,

})
const message = mongoose.model('message', messageSchema)

module.exports = message