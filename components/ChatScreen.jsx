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
import io from 'socket.io-client';

const socket = io('ws://localhost:1337');

const ChatScreen = ({chatId, chat}) => {
  const audioTone = useRef(new Audio('/messagetone.mp3')) 
  const endMessageRef = useRef()
  const [status, setStatus] = useState(false)
  const [messages, setMessages] = useState([])
  const [user] = useAuthState(auth)
  const [recipientUser, setRecipientUser] = useState({})
  const [input, setInput] = useState('')
  const recipientEmail = getRecipientEmail(chat.users, user)
  const scrollToView = ()=>{
    endMessageRef.current?.scrollIntoView({
      behavier: 'smooth',
      block: 'start'
    })
  }

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit("newUser", user.uid);

    });
    
    socket.on('online', (users)=>{
      setStatus(users.filter(user=> user.userId === recipientUser.id ? true : false))
    });

    socket.on('return message', (data)=>{
      audioTone.current.play()
    });

    socket.on('disconnecting', async ()=>{
      await updateDoc(doc(db, 'users', user.uid),{
        lastSeen: serverTimestamp()
      })
    })
  }, [user.uid, recipientUser.id]);

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
        }, 200);
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
                setRecipientUser({ id: doc.id, ...doc.data() })
            });
          })
     }
     get_Recipient_User()
}, [recipientEmail])

  const sendMessage = async ()=>{
    if(!input) return;

    await addDoc(collection(db, 'messages'), {
       timestamp: serverTimestamp(),
       message: input,
       user: user.email,
       chatId: chatId,
       isRead: false
    })
    socket.emit('new message', recipientUser.id)
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
            status ? 'online' : <p>last seen  <TimeAgo
            datetime={recipientUser?.lastSeen ? recipientUser?.lastSeen?.toDate() : 'unavailable'}
            locale='pk'
          /></p>
           )}
        </HeaderInformation>
        <HeaderIcons>
          {/* <IconButton>
             <AttachFileIcon />
          </IconButton> */}
          <IconButton>
              <MoreVert />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessagesContainer>
        {messages.sort((m1, m2)=> m1.timestamp - m2.timestamp).map((message, i) => (
          <Message key={message.id} message={message} user={user.email} />
        ))}
        <EndMessage ref={endMessageRef} />
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
  @media (max-width: 768px) {
    margin-left: 8px;
  }
  > h3{
    margin: 0;
    margin-bottom: 3px;
    @media (max-width: 768px) {
    font-size: 15px;
  }
  }
  > P{
    font-size: 14px;
  }
`;

const HeaderIcons = styled.div``;

const MessagesContainer = styled.div`
  padding: 6px;
  height: calc(100vh - 130px);
  background-color: #e5ded8;
  overflow-y: auto;
  @media (max-width: 568px) {
    padding: 2px;
  }

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
