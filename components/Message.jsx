import React, { useEffect } from 'react'
import styled from 'styled-components'
import moment from 'moment'; 
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Image from 'next/image'
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Message = ({message, user}) => {
  const MessageType = message.user === user ? Sender : Reciever;
  const ReadType = message.isRead ? IsRead : NotRead;

  useEffect(() => {
    async function updateMessage(){
        if (message.user === user && !document.hidden) return;

        await updateDoc(doc(db, 'messages', message.id), {
           isRead: true
        }, {merge: true})
    }
    updateMessage();
  }, [message, user])

  const handleDelete = async ()=>{
      await deleteDoc(doc(db, 'messages', message.id))
  }
  
//   handleDelete()
  return (
    <Container>
        {message.type === 'text' ? <MessageType>{message.message}
        {message.user === user && <span className='delete' ><IconButton onClick={handleDelete} sx={{color:'red'}}><DeleteIcon /></IconButton></span>}
        <TimeStamp>
           {message?.timestamp ? moment(message?.timestamp.toDate()).format('LT') : '...'}
            {message.user === user && <ReadType>&#10003;</ReadType>}
        </TimeStamp>
        </MessageType> : <MessageType>
        {message.user === user && <span className='delete' ><IconButton onClick={handleDelete} sx={{color:'red'}}><DeleteIcon /></IconButton></span>}
         <Image src={'/gifs/'+message.message} width={200} height={240} alt='gif' />
        <TimeStamp>
           {message?.timestamp ? moment(message?.timestamp.toDate()).format('LT') : '...'}
            {message.user === user && <ReadType>&#10003;</ReadType>}
        </TimeStamp>
        </MessageType>}
    </Container>
  )
}

export default Message

const Container = styled.div`
   position: relative;
   .delete{
      display: none;
   }
   :hover{
      .delete{
         display: inline;
         color: white;
         position: absolute;
         top: 5px;
         left: -40px;
         opacity: 0.5;
      }
   }
`;

const MessageElement = styled.p`
   width: fit-content;
   padding: 10px;
   margin: 12px;
   position: relative;
   text-align: right;
   margin-left: 10px;
   min-width: 78px;
   padding-bottom: 18px;
   box-shadow: 2px 2px 3px #8d8d8d18;
   border-radius: 10px;
   color: white;
   backdrop-filter: blur(10px);
   border: 3px solid #66666633;

`;

const Sender = styled(MessageElement)`
   margin-left: auto;
   background-color: #6f41b933;
   `;

const Reciever = styled(MessageElement)`
   background-color: #343d477e;
   text-align: left;
`;

const TimeStamp = styled.span`
   color: gray;
   position: absolute;
   bottom: 2px;
   font-size: 10px;
   margin-left: 12px;
   right: 5px;
   display: flex;
   align-items: center;
`;

const CheckMarkElement = styled.div`
      font-weight: 600;
      font-size: 10px;
      margin-left: 4px;
`;

const IsRead = styled(CheckMarkElement)`
      color: blue;
`;

const NotRead = styled(CheckMarkElement)`
      color: lightgray;
`;