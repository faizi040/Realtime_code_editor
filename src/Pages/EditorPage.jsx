import React, { useState, useRef, useEffect } from 'react';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { Actions } from '../Actions';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
// import { Socket } from 'socket.io';

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();  //getting room id the given in the path parameter
  const reactNavigator = useNavigate();
  //userRef to save data for multiple renders , our component will not re-render if userRef variable changes
  const [clients, setClients] = useState([])
  useEffect(() => {
    const init = async () => {

      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err))
      socketRef.current.on('connect_failed', (err) => handleErrors(err))
      const handleErrors = (e) => {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');

      }

      socketRef.current.emit(Actions.JOIN, {
        roomId,
        username: location.state?.username,   //accessing username sends from home page 
        //? in upper statement is new syntax of javascript it will check for usename in state if it does'nt exist it will not throw an error
      });

      //listening for joined event

      socketRef.current.on(Actions.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room`);
          console.log(`${username} joined`);
        }
        setClients(clients);
        socketRef.current.emit(Actions.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
      })

      // listening for disconnected event
      socketRef.current.on(Actions.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          //you can also give callback in stat update function in which you can get previous state and update it in the function according to your will
          return prev.filter(
            (client) => client.socketId !== socketId
          )
        })
      })
    }
    init();

    //now cleaning function to disconnect and unsunscribe all connections and events

    return () => {
      socketRef.current.off(Actions.JOINED);
      socketRef.current.off(Actions.DISCONNECTED);
      socketRef.current.disconnect();
    }

  }, [])

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);   //copr room id to clipboard
      toast.success('Room ID has been copied to clipboard');
    } catch (error) {
      toast.error('Could not copy the Room ID');
      console.error(error);
    }
  }
  const leaveRoom = () => {
    reactNavigator('/');
  }


  if (!location.state) {
    return <Navigate to='/' />
  }
  return (
    <div className='flex'>

      <div className='aside text-[#fff] text-center flex flex-col justify-between min-w-60   bg-black h-auto min-h-screen px-5'>
        <div>
          <div className="img  border-b border-[#424242]">
            <img className='h-[150px] mx-auto' src="/logo.png" alt="logo" />
          </div>
          <h3 className='font-medium my-5'>Connected Participants</h3>
          <div className="clientList gap-5">
            {      //shorter way f map function
              clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))
            }
          </div>
        </div>
        <div className="flex flex-col items-center ">
          <button className='mt-6  w-[100%]  border-none p-2 rounded-lg text-[16px] cursor-pointer transition-all duration-300 ease-in-out bg-[#fff] text-black font-medium' onClick={copyRoomId}>Copy Room ID</button>

          <button className='my-6  w-[100%]  border-none p-2 rounded-lg text-[16px] cursor-pointer transition-all duration-300 ease-in-out bg-[#13F9EB] text-black  hover:bg-[#39e1c0] font-medium' onClick={leaveRoom}>Leave</button>
        </div>
      </div>
      <div><Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => { codeRef.current = code; }} /></div>

    </div>
  )
}

export default EditorPage