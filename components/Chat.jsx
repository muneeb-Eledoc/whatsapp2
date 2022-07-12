import { Avatar } from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { db } from '../firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import {useRouter} from 'next/router'

const Chat = ({users, id, user}) => {
  const router = useRouter()
  const [recipientUser, setRecipientUser] = useState({})
  const recipientEmail = getRecipientEmail(users, user)

  useEffect(() => {
    const get_Recipient_User = async ()=>{
       const q = query(collection(db, 'users'), where('email', '==', recipientEmail))
       const snapshot = await getDocs(q)
       snapshot.forEach((doc) => {
           setRecipientUser(doc.data())
       });
    }
    get_Recipient_User()
  }, [recipientEmail])
  
  const onChatEnter = ()=>{
     router.push(`/chat/${id}`)
  }

  return (
    <Container onClick={onChatEnter}>
       {recipientUser ? (
        <UserAvatar src={recipientUser?.photoURL} />
       ) : (
        <UserAvatar />
       )}
       <Email>
          {recipientEmail}
       </Email>
    </Container>
  )
}

export default Chat

const Container = styled.div`
   display: flex;
   align-items: center;
   cursor: pointer;
   padding: 7px 10px;
   word-break: break-word;
   border-bottom: 1px solid whitesmoke;
   :hover{
    background-color: #f1f1f1;
   }
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  margin: 5px;
  margin-right: 15px;
`;

const Email = styled.p`
     
`;