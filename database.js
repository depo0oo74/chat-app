const mongoose = require('mongoose')

// const DB_URL = 'mongodb://localhost:27017/chatApp'
const DB_URL = 'mongodb+srv://dep0oo74:ahmedaya372019@dep0oo74.mk0uu.mongodb.net/chatApp?retryWrites=true&w=majority'

mongoose.connect(DB_URL , {
    useUnifiedTopology: true ,
    useNewUrlParser: true
}).then(() => {
    console.log('connected mongodb')
}).catch(err => {
    console.log('error' , err)
})