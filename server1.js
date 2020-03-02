import express from 'express';
import http from 'http';
import cors from 'cors';  
import sockectio from 'socket.io';

const app = express();

app.use(cors());
const server = http.Server(app);
const io = sockectio(server); // cross domain
io.set('origins', '*:*'); //cross domain
server.listen(8082);


io.on('connection', (socket) => {
    
    socket.emit('fromback', { hello: `Hello front ${socket.id}` });

    socket.on('fromfront', (data) => {
        socket.emit('fromback', { hello: `recebido ${socket.id}!` });
    });
});

//server 2 connection
io.on('connect', (socket) => {
    socket.emit('clientEvent', { hello: `Hello ${socket.id}` });
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});



