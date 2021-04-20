const express=require('express');
const path=require('path');
const http=require('http');
const socketio=require('socket.io');
const app=express();
const server=http.createServer(app);
const io=socketio(server);
const {formatmsg,infomsg,adduser,getUser,userLeave,getRoomUsers}= require('./script.js');

const admin="ADMIN";
io.on('connection',socket=>{
    socket.on('joinRoom', ({username,room})=>{
        const user= adduser(socket.id,username,room);
        socket.join(user.room);
        socket.emit('message', formatmsg(admin,'Welcome to Bingo , Get Started!'));

    socket.broadcast.to(user.room).emit('info',infomsg(`${user.username} joined the chat`));
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    });


    socket.on('chatmsg', msg=>{
        const user=getUser(socket.id);
        io.to(user.room).emit('message',formatmsg(user.username,msg));
    });
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('info',infomsg(`${user.username} left the chat`));
     
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
      }
    });
});




app.set('view engine', 'ejs');
const port=3000 || process.env.PORT;
server.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});

//app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res)=>{
   res.render('index');
});

app.get('/chat', (req,res)=>{
    res.render('chat');
});
