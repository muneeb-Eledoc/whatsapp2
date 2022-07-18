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
import { socket } from '../utils/socket';

const ChatScreen = ({chatId, chat}) => {
  const endMessageRef = useRef()
  const [onlineUsers, setOnlineUsers] = useState([])
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
  
  const options = {
    body: 'Hi there',
    icon: "/whatsapp.jpg",
    vibrate: [200, 100, 200],
    tag: "new-product",
    image: '/whatsapp.jpg',
    badge: "https://spyna.it/icons/android-icon-192x192.png",
    actions: [{ action: "Detail", title: "View", icon: "https://via.placeholder.com/128/ff0000" }]
  };
  navigator.serviceWorker.ready.then(function(serviceWorker) {
    serviceWorker.showNotification('my  notification', options);
  });

  useEffect(() => {
    socket.emit("newUser", user.uid);

    socket.on('online', (users)=>{
      setOnlineUsers(users)
    });

  }, [user, recipientUser.id]);

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

  const checkUserOnline = ()=>{
    const online = onlineUsers.find((user) => user.userId === recipientUser.id);
    return online ? true : false; 
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
            checkUserOnline() ? 'online' : <p>last seen  <TimeAgo
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
  background: url('/background.jpg');
  background-repeat: no-repeat;
  background-size: cover;
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
    background-color: whitesmoke;
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
   background-color: whitesmoke;
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
