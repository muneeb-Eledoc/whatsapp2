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
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { socket } from '../utils/socket';
import Emoji from './Emoji';
import SendIcon from '@mui/icons-material/Send';
import moment from 'moment';
import Gifs from './Gifs';
import GifBoxIcon from '@mui/icons-material/GifBox';

const ChatScreen = ({chatId, chat, onlineUsers}) => {
  const endMessageRef = useRef()
  const [messages, setMessages] = useState([])
  const [user] = useAuthState(auth)
  const [recipientUser, setRecipientUser] = useState({})
  const [input, setInput] = useState('')
  const recipientEmail = getRecipientEmail(chat.users, user)
  const [showEmoji, setShowEmoji] = useState(false)
  const [typing, setTyping] = useState(false)
  const [showGif, setShowGif] = useState(false)
  const [gif, setGif] = useState('')

  const scrollToView = ()=>{
    endMessageRef.current?.scrollIntoView({
      behavier: 'smooth',
      block: 'start'
    })
  }

  useEffect(() => {
    socket.on('istyping', ({typing})=>{
      setTyping(typing)
    })

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

  const sendMessage = async (e)=>{
    e.preventDefault()

    if(input===''){
      if(gif===''){
        return
      }
    }

    await addDoc(collection(db, 'messages'), {
       timestamp: serverTimestamp(),
       message: gif===''?input:gif,
       type: gif===''? 'text' : 'gif',
       user: user.email,
       chatId: chatId,
       isRead: false
    })
    socket.emit('new message', recipientUser.id)
    setInput('')
    setGif('')
    setShowGif(false)
  }

  const checkUserOnline = ()=>{
    const online = onlineUsers.find((user) => user.userId === recipientUser.id);
    return online ? true : false; 
  }

  const emojiChange = (emojiObject) => {
    setInput(prev=> prev + emojiObject.emoji);
  };

  const handleChange = (e)=>{
    setInput(e.target.value)
  }

  const handleTyping = ()=>{
    socket.emit('typing', {currentUserId: user.uid, recipientUserId: recipientUser.id})

    setTimeout(() => {
      socket.emit('stop typing', {currentUserId: user.uid, recipientUserId: recipientUser.id})      
    }, 3000);
  }

  return (
    <Container>
      <Header>
        {Object.keys(recipientUser).length > 0 ?
         <Avatar src={recipientUser.photoURL}/>:<Avatar />
         }
        <HeaderInformation>
           <h3>{recipientEmail}</h3>
           {!typing ? recipientUser && (
            checkUserOnline() ? <Online>online</Online> : <Online>
              last seen  {recipientUser?.lastSeen ? moment(recipientUser?.lastSeen.toDate()).format('LT') : '...'}
            </Online>
           ) : (<Typing>typing...</Typing>)}
        </HeaderInformation>
        <HeaderIcons>
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
       
     {showEmoji && <EmojiContainer>
      <Emoji emojiChange={emojiChange}/>
      </EmojiContainer>}

      {showGif && <Gifs setGif={setGif} gif={gif} sendMessage={sendMessage}/>}
      
      <InputContainer onSubmit={sendMessage}>
        <IconButton onClick={()=> {setShowGif(!showGif); setGif('')}} >
          <GifBoxIcon />
        </IconButton>
        <IconButton onClick={()=> setShowEmoji(!showEmoji)}>
          <EmojiEmotionsIcon />
        </IconButton>
     {gif ==='' && <><StyleInput placeholder='Type Message' value={input} onChange={handleChange} onKeyDown={handleTyping} /> 
        <IconButton type='submit'>
          <SendIcon  />
        </IconButton>
        <IconButton>
          <MicIcon />
        </IconButton></>}
      </InputContainer>
    </Container>
  )
}

export default ChatScreen

const Container = styled.div`
  position: relative;
  background: linear-gradient(to right,#75BBCB, #2D7A95);
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
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  backdrop-filter: blur(5px);
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

const StyleInput = styled.input`
    flex: 1;
    border: none;
    border-radius: 10px;
    padding: 12px 10px;
    font-size: 15px;
    outline: none;
`;

const EmojiContainer = styled.div`
    position: absolute;
    bottom: 67px;
    left: 2px;
`;

const Typing = styled.div`
    font-size: 15px;
    font-weight: 600;
    color: #089654;
`;

const Online = styled.div`
    font-size: 15px;
    color: gray;
    font-weight: 600;
`;