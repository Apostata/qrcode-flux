
import path from 'path';
import ioClient from 'socket.io-client';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';  

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/public')));

const socketclient = ioClient.connect('http://localhost:8082', {reconnect: true});

const processQrCode = (id) => {
    setTimeout(()=>{
        socketclient.emit('qrcodeStatus', {status:'success', socketID:id});
    }, 2000)
}


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index2.html');
});

app.get('/qrcode', (req, res) =>{
    res.status(200).send({qrcode:"qrcodeData", status:'wating'});
})

app.post('/qrcode/proccess', (req, res) =>{
    console.log(req)
    let { id } = req.body;
    console.log(id);
    socketclient.emit('qrcodeStatus', {status:'processing', socketID:id});
    processQrCode(id);
    // res.status(200).send({status:'pending'});
    res.redirect('/');
});



const clients = [];


const initializeQRcode = (id) =>{
    // ... prepareQrCode
    console.log(`initilized to id ${id}`);
    clients.push(id);
    console.log('initializeQRcode', {status:'wating', socketID:id});
};

const processQRCodePayment = (id) =>{
    // ... 
    socketclient.to(id).emit('toProcessQRcodePayment', {status:'processing', socketID:id});
    setTimeout(()=>{
        socketclient.emit('toProcessQRcodePayment', {status:'success', socketID:id});
    }, 2000)
}


// ------------------- sockect listeners
socketclient.on('tofront1', (data) => {
    console.log(data);
});

socketclient.on('initializeQRcode', (id) => {
    initializeQRcode(id);
});

socketclient.on('processQRCodePayment', (id) => {
    processQRCodePayment(id);
});

app.listen(8083);


