import React, { useEffect } from 'react'
import styled from 'styled-components'
import moment from 'moment'; 
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Message = ({message, user}) => {
  const MessageType = message.user === user ? Sender : Reciever;
  const ReadType = message.isRead ? IsRead : NotRead;

  useEffect(() => {
    async function updateMessage(){
        if (message.user === user) return;

        await updateDoc(doc(db, 'messages', message.id), {
           isRead: true
        }, {merge: true})
    }
    updateMessage();
  }, [message, user])
  
  return (
    <Container>
        <MessageType>{message.message}
        <TimeStamp>
           {message?.timestamp ? moment(message?.timestamp.toDate()).format('LT') : '...'}
            <ReadType>&#10003;</ReadType>
        </TimeStamp>
        </MessageType>
    </Container>
  )
}

export default Message

const Container = styled.div`
   position: relative;
`;

const MessageElement = styled.p`
   width: fit-content;
   padding: 10px;
   border-radius: 7px;
   margin: 12px;
   position: relative;
   text-align: right;
   margin-left: 10px;
   min-width: 75px;
   padding-bottom: 18px;
   box-shadow: 0 0 8px rgba(0,0,0,0.12);
`;

const Sender = styled(MessageElement)`
   margin-left: auto;
   background-color: #dcfBc6;
`;

const Reciever = styled(MessageElement)`
   background-color: whitesmoke;
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