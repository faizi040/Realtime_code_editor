import express from 'express';
const app = express();
import http from 'node:http';
import { Server } from 'socket.io';
import { Actions } from './src/Actions.js';
import { fileURLToPath } from 'url';
import path,{ dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('dist'));    //request will be served to dis folder index.html

// now to handle page refresh problem in productin build


app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'dist','index.html'));
})

const userSocketMap = {}

const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId], //getting username against socketId from userSocketMap
        }
    })
}

io.on('connection', (socket) => {
    console.log('socket conected', socket.id);
    socket.on(Actions.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);   //will join the room with socket id
        const clients = getAllConnectedClients(roomId);
        //will provide all clients joined in a particular room
        clients.forEach(({ socketId }) => {

            io.to(socketId).emit(Actions.JOINED, {
                clients,
                username,
                socketId: socket.id,
            })
        })
    })

    socket.on(Actions.CODE_CHANGE,({roomId,code})=>{
        socket.in(roomId).emit(Actions.CODE_CHANGE,{code});
    });
    socket.on(Actions.SYNC_CODE,({socketId,code})=>{
        io.to(socketId).emit(Actions.CODE_CHANGE,{code});
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];  //getting all rooms in a socket and putting them in an array
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(Actions.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();  //to officially leave a room in socket io

    });
});


const PORT = 5000;
server.listen(PORT, () => { console.log(`Listening on port ${PORT}`) });