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
    socket.on('initialize', function (){
        const id =  this.id;

        axios.get('http://localhost:8083/qrcode') // Pega QRCode
            .then(response =>{
                const resp = {...response.data, id};
                io.to(id).emit('qrcodeStatus', resp);
            }).catch(err=>{
                console.log(err);
            })
    });
});

app.post('/qrcode/proccess', (req, res) =>{
    let { id } = req.body;
    const data = {status:'pending', socketID:id};
    io.to(id).emit('qrcodeStatus', data);
    processQrCode(id);
    res.status(200).send(data);
})

server.listen(8082);