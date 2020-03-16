import path from 'path';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import sockectio from 'socket.io';
import axios from 'axios';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
const server = http.Server(app);
const io = sockectio(server); // cross domain
io.set('origins', '*:*'); //cross domain
app.use(express.static(path.join(__dirname, '/public')));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index1.html');
});

const processQrCode = (id) => {
    setTimeout(()=>{
        io.to(id).emit('qrcodeStatus', {status:'success', socketID:id});
    }, 2000)
}


io.on('connection', (socket) => {
    io.to(socket.id).emit('qrcodeStatus', 'connected');

    socket.on('initialize', function (){
        const id =  this.id;
        console.log(`initialize - ${id}`);
        axios.get('http://localhost:8083/qrcode') // Pega QRCode
            .then(response =>{
                const resp = {...response.data, socketID:id, qrcode:"00020101021226580014br.com.padraoq0116000000000041947102080038505803040002520400005303986540515.155802BR5915Comercio Getnet6012Porto Alegre622905255413c370690269905d08dc8d781600014br.com.padraoq01122002102014530204000103020104020105020382210107c2eb118020600001863040778"};
                io.to(id).emit('qrcodeStatus', resp);
            }).catch(err=>{
                console.log(err);
            })
    });

    socket.on('finalize', function(){
        socket.disconnect(true);
    })
});

app.post('/qrcode/proccess', (req, res) =>{
    let { id } = req.body;
    const data = {status:'pending', socketID:id};
    io.to(id).emit('qrcodeStatus', data);
    processQrCode(id);
    res.status(200).send(data);
})

server.listen(8082);