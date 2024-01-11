import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUserName] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        let id = uuid();
        setRoomId(id);
        toast.success('created new room');
    }
    const joinRoom=()=>{
        if(!roomId || !username){
            toast.error('Username and roomID is required');
            return;
        }
        navigate(`/editor/${roomId}`,{
            state:{
                username,   
                //sending state data when redurecting to a specific route using react router dom method
            }

        })
    }
    const handleInputEnter=(e)=>{  //function to join room by enter button
        if(e.code==="Enter"){
            joinRoom();
        }

    }
    return (
        <div className='flex justify-center items-center text-[#fff] h-screen'>
            <div className='bg-[#282a36] p-6 rounded-lg w-[400px] max-w-[90%]'>
                <img src="/logo.png" className='mt-0 h-[250px] mx-auto' alt="Not Found" />
                <h3 className='text-lg font-medium mb-[10px] mt-0'>Paste Invitation Room ID</h3>
                <div className="flex flex-col">
                    <input type="text" name="roomId" value={roomId} onChange={(e)=>{setRoomId(e.target.value)}} onKeyUp={handleInputEnter}  className=" p-[10px] rounded-md outline-none border-none mb-[14px] text-gray-700 text-[16px] font-medium bg-[#eee] placeholder:text-gray-400" placeholder="Room ID" />

                    <input type="text" name="username" value={username} onChange={(e)=>{setUserName(e.target.value)}} onKeyUp={handleInputEnter}  className=" p-[10px] rounded-md outline-none border-none mb-[14px] text-gray-700 text-[16px] font-medium bg-[#eee] placeholder:text-gray-400" placeholder="UserName" />

                    <button className='border-none p-2 rounded-lg text-[16px] cursor-pointer transition-all duration-300 ease-in-out bg-[#13F9EB] hover:bg-[#39e1c0]' onClick={joinRoom}>
                        Join
                    </button>
                    <span className='mt-4'>If you don't have an invite then  &nbsp; <a className='no-underline text-[#13F9EB] cursor-pointer' onClick={createNewRoom}>create new room</a> </span>

                </div>


            </div>
            <footer className='fixed bottom-0'>
                <span>Built wilt love by <a className='no-underline text-[#13F9EB] cursor-pointer' href="https://github.com/faizi040" target='_blank'>Muhammad Faiz Rasool</a></span>
            </footer>
        </div>
    )
}

export default Home