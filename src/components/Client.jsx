import React from 'react';
import Avatar from 'react-avatar';

const Client = ({username}) => {
  return (
    <div>
        <Avatar name={username} size={50} round='15px'/>
        <p className='font-medium my-2'>{username}</p>
        
        
        </div>
  )
}

export default Client