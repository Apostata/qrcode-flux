// Serve simulação do executor de pagamento que connecta com o backend da tela
// a visualização do front é só para simular o tempo de escaneamento e pagamento pelo aplicativo

import path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index2.html');
});

app.get('/qrcode', (req, res) =>{
    res.status(200).send({qrcode:"qrcodeData", status:'wating'});
})

app.post('/qrcode/proccess', (req, res) =>{
    let { id } = req.body;
    const data = `id=${id}`;
   
    axios.post('http://localhost:8082/qrcode/proccess', data)
    .then(response => {
        console.log('QRcode enviado para processamento',response.data)
        res.redirect('/?status=enviado_processamento');

    }).catch(err=>{
        console.log(err.error.message);
    });
    
});

app.listen(8083);


