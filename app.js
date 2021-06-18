const express = require('express')
const app = express();
require('./database')
const path = require('path')
const server = require('http').createServer(app)
const socketIO = require('socket.io')(server)
const session = require('express-session')
const sessionStore = require('connect-mongodb-session')(session)
const myStore = new sessionStore({
    uri : 'mongodb+srv://dep0oo74:ahmedaya372019@dep0oo74.mk0uu.mongodb.net/chatApp?retryWrites=true&w=majority' ,
    collection : 'sessions'
})
const flash = require('connect-flash')

// require routes 
const friendsRoute = require('./routes/friends-route')
const loginRoute = require('./routes/login-route');
const signupRoute = require('./routes/signup-route')
const logoutRoute = require('./routes/logout-route')
const profileRoute = require('./routes/profile-route')
const chatRoute = require('./routes/chat-route')
const notFoundController = require('./controllers/notFound-controller');

// set ejs as template engine
app.set('views', 'views')
app.set('view engine', 'ejs')


// use assets & uploads as a static files
app.use(express.static(path.join(__dirname , 'views', 'assets')))
app.use(express.static(path.join(__dirname , 'uploads')))

// use session 
app.use(session({
    secret : 'this app developed by node js' ,
    saveUninitialized : false ,
    resave : true ,
    store : myStore
}))

// use flash session
app.use(flash())

// sockets 

socketIO.on('connection', socket => {
    require('./sockets')(socketIO , socket)
})

// use routes
app.use(friendsRoute)
app.use(loginRoute)
app.use(signupRoute)
app.use(logoutRoute)
app.use(profileRoute)  
app.use(chatRoute)
app.use(notFoundController.notFound)


// run serve at port 3000

const port = process.env.PORT || 3000

server.listen(port)