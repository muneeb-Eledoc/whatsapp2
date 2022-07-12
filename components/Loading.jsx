import { ThreeBounce } from 'better-react-spinkit';
import React from 'react'
import Image from 'next/image';

const Loading = () => {
  return (
    <div className='loading__Container'>
       <ThreeBounce size={25} />
    </div>
  )
}

export default Loading