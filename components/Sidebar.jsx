import Avatar from '@mui/material/Avatar';
import {useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MessageIcon from '@mui/icons-material/Message';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from 'email-validator'
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { addDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import Chat from '../components/Chat'
import { socket } from '../utils/socket';

const Sidebar = ({mobile}) => {
  const [user] = useAuthState(auth)
  const [chats, setChats] = useState([])
  const audioTone = useRef(new Audio('/messagetone.mp3')) 
  const activetone = useRef(new Audio('/activetone.mp3'))

  useEffect(() => {
    socket.on('return message', (data)=>{
      document.hidden ? audioTone.current.play() : activetone.current.play()
    });
  },[])

  useEffect(()=>{
    const getChat = async ()=>{
      const q = query(collection(db, 'chats'), where("users", "array-contains", user.email));
      onSnapshot(q, (querySnapshot) => {
        let data = [];
        querySnapshot.forEach((doc) => {
          data.push({
            ...doc.data(),
            id: doc.id
          })
        });
        setChats(data)
      });
    }
    getChat()
  },[user])

  const createChat = async ()=>{
    const input = prompt('Please enter an email address for the user you wish to chat with.')
    if(!input) return;

    if(EmailValidator.validate(input) && input !== user.email && !chatAlreadyExists(input)){
       await addDoc(collection(db, 'chats'),{
          users: [user.email, input]
       })
    }

  }

  const chatAlreadyExists = (recipientEmail)=>{
    return !!chats.find((chat=> chat.users.find((user)=> user === recipientEmail)?.length > 0))
  }
  const SidebarType = mobile ? MobileSidebar : NormalSidebar
  return (
    <SidebarType>
        <Header>
            <UserAvatar src={user?.photoURL} onClick={()=>{
              signOut(auth).then(() => {
              }).catch((error) => {
              });
            }}/>
            <IconsContainer>
              <IconButton sx={{color:'whitesmoke'}}>
                <MessageIcon />
              </IconButton>
              <IconButton sx={{color:'whitesmoke'}}>
                <MoreVertIcon />
              </IconButton>
            </IconsContainer>
        </Header>

        <Search>
          <SearchWrapper>
            <StyledSearchIcon />
            <Input placeholder='Search chat' />
          </SearchWrapper>
        </Search>

        <StyledButton onClick={createChat} sx={{color:'whitesmoke'}}>
          Start New Chat
        </StyledButton>

        {/* List of chat */}
        <ChatContainer>
          {chats.map(chat=>(
            <Chat key={chat.id} users={chat.users} id={chat.id} user={user} />
          ))}
        </ChatContainer>

    </SidebarType>
  )
}

export default Sidebar

const MainContainer = styled.div`
    display: flex;
   flex-direction: column;
   border-right: 1px solid #353333;
   height: 100vh;
   flex: 0.40;
   min-width: 300px;
   max-width: 380px;
   overflow: hidden;
   ::-webkit-scrollbar{
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  background: url('https://images.unsplash.com/photo-1545598917-9344335719fe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80');
`;

const MobileSidebar = styled(MainContainer)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const NormalSidebar = styled(MainContainer)`
  @media (max-width: 768px) {
    max-width: 100%;
    flex: 1;
  }
`;

const ChatContainer = styled.div`
   display: flex;
   flex-direction: column;
   flex-grow: 1;
   overflow-y: auto;
   backdrop-filter: blur(14px);
   background-color: rgba(0,0,0,0.5);
    ::-webkit-scrollbar{
     width: 6px;
  }
  ::-webkit-scrollbar-track{
     background-color: #46464639;
  }
  ::-webkit-scrollbar-thumb{
     background-color: #f8d9bf53;
  }
`;

const Header = styled.div`
   padding: 12px;
   display: flex;
   justify-content: space-between;
   border-bottom: 3px solid #08080864;
   position: sticky;
   top: 0;
   z-index: 100;
   backdrop-filter: blur(12px);
   background-color: rgba(0,0,0,0.5);
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover{
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Search = styled.div`
  width: 100%;
  display: flex;
  height: 48px;
  align-items: center;
  padding: 5px 15px;
  border-bottom: 3px solid rgba(0,0,0,0.4);
  backdrop-filter: blur(10px);
   background-color: rgba(0,0,0,0.5);

`;

const SearchWrapper = styled.div`
  width: 100%;
  display: flex;
   background-color: #504c614c;
  border-radius: 8px;
  height: 37px;
  padding: 4px 8px;
  border: 3px solid rgba(0,0,0,0.3);

`;

const StyledSearchIcon = styled(SearchIcon)`
  align-self: center;
  color: #c0bebe;
  margin-right: 10px;
  font-size: 22px;
`;

const Input = styled.input`
   flex: 1;
   outline: none;
   border: none;
   background: none;
   color: white;
`;

const StyledButton = styled(IconButton)`
    width: 100%;
    margin: 1px 3px;
    backdrop-filter: blur(10px);
    
    &&&{
      border-bottom: 3px solid rgba(0,0,0,0.4);
      background-color: rgba(0,0,0,0.5);
      font-size: 18px;
      border-radius: 3px;
    }
`;