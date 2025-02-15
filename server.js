const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const PORT = 3000 || process.env.PORT;
const botName = 'Admin Bot';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        
        socket.join(user.room);

        socket.emit('message', formatMessage(botName, 'Bienvenido al Chat Online!'));

        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} se unio al chat`));
    });

    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} salio del chat`));
        }
    });
});

server.listen(PORT, () => console.log(`Server ejecutandose en el puerto ${PORT}`));