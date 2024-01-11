import { io } from "socket.io-client";


export const initSocket=async()=>{
    //this function will return a socket client instance
    const options = {
        'force new connection':true,
        reconnectionAttempt: 'Infinity',
        timeout : 10000,
        transports : ['websocket'],
    }
    return io(import.meta.env.VITE_REACT_BACKEND_URL,options);
}