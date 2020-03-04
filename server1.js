import path from 'path';
import express from 'express';
import http from 'http';
import cors from 'cors';  
import sockectio from 'socket.io';
import axios from 'axios';

const app = express();

app.use(cors());
const server = http.Server(app);
const io = sockectio(server); // cross domain
io.set('origins', '*:*'); //cross domain
app.use(express.static(path.join(__dirname, '/public')));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index1.html');
});


io.on('connection', (socket) => {
    console.log(socket.id);
    
    socket.on('initialize', function (socket){
        const id =  this.id;
        //io.emit('initializeQRcode', id);
        axios.get('http://localhost:8083/qrcode')
            .then(response =>{
                const resp = {...response.data, id};
                io.to(id).emit('qrcodeStatus', resp);
            }).catch(err=>{
                console.log(err);
            })
    });

    socket.on('processQRCodePayment', function (data) {
        const socketID = data.socketID;
        io.to(socketID).emit(data);
    });

    socket.on('qrcodeStatus', function (data) {
        console.log('status', data);
        const socketID = data.socketID;
        io.to(socketID).emit('qrcodeStatus', data);
    })
       
});

server.listen(8082);