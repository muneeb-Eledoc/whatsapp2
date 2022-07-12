import MoreVert from '@mui/icons-material/MoreVert';
import { Avatar, IconButton } from '@mui/material';
import React, { useEffect, useState,useRef } from 'react'
import styled from 'styled-components';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import { addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Message from './Message';
import getRecipientEmail from '../utils/getRecipientEmail'
import TimeAgo from 'timeago-react'; 
import InputEmoji from "react-input-emoji";

const ChatScreen = ({chatId, chat}) => {
  const EndMessageRef = useRef()
  const [messages, setMessages] = useState([])
  const [user] = useAuthState(auth)
  const [recipientUser, setRecipientUser] = useState({})
  const [input, setInput] = useState('')
  const recipientEmail = getRecipientEmail(chat.users, user)

  const scrollToView = ()=>{
    EndMessageRef.current.scrollIntoView({
      behavier: 'smooth',
      block: 'start'
    })
  }

  useEffect(()=>{
     const getMessages = async ()=>{
       const q = query(collection(db, 'messages'), where("chatId", "==", chatId), orderBy('timestamp', 'asc'));
      onSnapshot(q, (querySnapshot) => {
        let data = [];
        querySnapshot.forEach((doc) => {
          data.push({
            ...doc.data(),
            id: doc.id
          })
        });
        setMessages(data)
        setTimeout(() => {
          scrollToView()
        }, 100);
      });
     } 
     getMessages()
  },[chatId])

  
  useEffect(() => {
    setRecipientUser({})
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

  const sendMessage = async ()=>{
    if(!input) return;

    await updateDoc(doc(db, 'users', user.uid),{
      lastSeen: serverTimestamp()
    })
    await addDoc(collection(db, 'messages'), {
       timestamp: serverTimestamp(),
       message: input,
       user: user.email,
       chatId: chatId,
       isRead: false
    })
    scrollToView()
    setInput('')
  }
  return (
    <Container>
      <Header>
        {Object.keys(recipientUser).length > 0 ?
         <Avatar src={recipientUser.photoURL}/>:<Avatar />
         }
        <HeaderInformation>
           <h3>{recipientEmail}</h3>
           {recipientUser && (
            <p>Last seen  <TimeAgo
            datetime={recipientUser?.lastSeen ? recipientUser?.lastSeen?.toDate() : 'unavailable'}
            locale='pk'
          /></p>
           )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
             <AttachFileIcon />
          </IconButton>
          <IconButton>
              <MoreVert />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessagesContainer>
        {messages.sort((m1, m2)=> m1.timestamp - m2.timestamp).map((message, i) => (
          <Message key={message.id} message={message} user={user.email} />
        ))}
        <EndMessage ref={EndMessageRef} />
      </MessagesContainer>

      <InputContainer>
        <StyledInputEmoji value={input} onChange={setInput} borderRadius={8} background='whitesmoke' onEnter={sendMessage}/>
        <IconButton>
          <MicIcon />
        </IconButton>
      </InputContainer>
    </Container>
  )
}

export default ChatScreen

const Container = styled.div`
   
`;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    height: 65px;
    display: flex;
    padding: 11px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;
  > h3{
    margin: 0;
    margin-bottom: 3px;
  }
  > P{
    font-size: 14px;
  }
`;

const HeaderIcons = styled.div``;

const MessagesContainer = styled.div`
  padding: 30px;
  height: calc(100vh - 130px);
  background-color: #e5ded8;
  overflow-y: auto;
`;

const EndMessage = styled.div``;

const InputContainer = styled.form`
   display: flex;
   padding: 10px;
   position: sticky;
   bottom: 0;
   z-index: 100;
   align-items: center;
   background-color: white;
   height: 65px;
`;

const StyledInputEmoji = styled(InputEmoji)`
    /* flex: 1;
    outline: none;
    margin-left: 4px;
    padding: 10px 12px;
    font-size: 16px;
    border-radius: 8px;
    border:none; */
    /* background-color: whitesmoke; */
`;
