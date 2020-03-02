
import io from 'socket.io-client';


const socket = io.connect('http://localhost:8082', {reconnect: true});
 
socket.on('connect', ()=>{
    socket.on('clientEvent', (data) => {
        console.log('Server2 client - message from the server1:', data);
    });
});