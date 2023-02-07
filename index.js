/*
Student Name: Naveen Jose
Student Num: 101238395
*/

var express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
const path = require('path')

const userRouter = require('./routes/UserRoute')
const messageRouter = require('./routes/ChatRoute')

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, '/')))
app.use(cors())
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/index.html", (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

//MongoDB Schema
var Message = mongoose.model('Message', {
  username: String,
  message: String,
  room: String
})

var message;

app.post('/ChatApp', (req, res) => {

  message = new Message(req.body);

  message.save((err) => {
    if (err) {
      console.log(err)
    }

    res.sendStatus(200);
  })
})


app.get('/ChatApp', (req, res) => {
  Message.find({}, (err, ChatApp) => {
    res.send(ChatApp);
  })
})


const users = [];

io.on('connection', (socket) => {

  console.log(`${socket.id} Connected...`)

  socket.emit("situation", ({ username: '', message: `Welcome` }))

  socket.broadcast.emit("joinRoom", ({ username: `${users[0]} Connected...`, message: '' }))


  //Get chat message
  socket.on('userInfo', ({ username, room, message }) => {
    users.push(username)
    socket.join(room)
    socket.broadcast.to(room).emit("joinRoom", ({ username, room, message }))
    socket.emit("joinRoom", ({ username, room, message }))
  });

  socket.on("disconnect", () => {
    io.emit("situation", ({ username: '', message: `${users[0]} Disconnected...` }))
  })
})

mongoose.connect(`mongodb+srv://naveenjose:naveenjose123@cluster0.xvntevj.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then(success => {
    console.log('Success Mongodb connection')
}).catch(err => {
    console.log('Error Mongodb connection')
});

app.use(userRouter);
app.use(messageRouter);

server.listen(port=3000, () => { console.log(`Server is running on port ${port}`) });