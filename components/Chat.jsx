import { Avatar } from '@mui/material';
import { collection, query, where, onSnapshot, limit, orderBy } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { db } from '../firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import {useRouter} from 'next/router'

const Chat = ({users, id, user}) => {
  const router = useRouter()
  const [recipientUser, setRecipientUser] = useState({})
  const recipientEmail = getRecipientEmail(users, user)
  const [lastMessage, setLastMessage] = useState({})

  useEffect(() => {
    const get_Recipient_User = async ()=>{
       const q = query(collection(db, 'users'), where('email', '==', recipientEmail))
       onSnapshot(q, (snapshot)=>{
          snapshot.forEach((doc) => {
              setRecipientUser(doc.data())
          });
       })
    }
    get_Recipient_User()
  }, [recipientEmail])

  useEffect(() => {
     const getLastMessage = async(_id)=>{
      const q = query(collection(db, 'messages'), where("chatId", "==", _id), orderBy('timestamp', 'desc'), limit(1));
        onSnapshot(q, (querySnapshot) => {
         querySnapshot.forEach((doc) => {
             setLastMessage(doc.data())
         })
        })
     }
     getLastMessage(id)
  },[id])
  
  const onChatEnter = ()=>{
     router.push(`/chat/${id}`)
  }  
  const ReadType = lastMessage.isRead ? IsRead : NotRead;
  return (
    <Container onClick={onChatEnter}>
       {recipientUser ? (
        <UserAvatar src={recipientUser?.photoURL} />
       ) : (
        <UserAvatar />
       )}
       <InformationContainer>
         <Email>
            {recipientEmail}
         </Email>
         <LastMessage>
         <ReadType>&#10003;</ReadType> {lastMessage.message}
         </LastMessage>
       </InformationContainer>
    </Container>
  )
}

export default Chat

const Container = styled.div`
   display: flex;
   box-shadow: 0px 0px 2px rgba(0,0,0,0.1);
   align-items: center;
   cursor: pointer;
   padding: 7px 10px;
   word-break: break-word;
   border-bottom: 1px solid whitesmoke;
   :hover{
    background-color: #f1f1f1;
   }
   :active{
      background-color: lightgray;
   }
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  margin: 5px;
  margin-right: 15px;
`;

const InformationContainer = styled.div`
   display: flex;
   flex-direction: column;
   gap: 5px;
   justify-content: center;
`;

const LastMessage = styled.span`
   color: gray;
   font-size: 14px;
   display: flex;
   align-items: center;

`;

const Email = styled.p`
     font-weight: 600;
`;

const CheckMarkElement = styled.div`
      font-weight: 600;
      font-size: 10px;
      margin-right: 4px;
`;

const IsRead = styled(CheckMarkElement)`
      color: blue;
`;

const NotRead = styled(CheckMarkElement)`
      color: lightgray;
`;