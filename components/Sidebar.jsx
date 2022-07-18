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
              <IconButton>
                <MessageIcon />
              </IconButton>
              <IconButton>
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

        <StyledButton onClick={createChat}>
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
   border-right: 1px solid #ebebeb;
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
   /* height: 77.2vh; */
   > * {
      &:first-child {
        border-top: 1px solid #e5ded8;
      }
    }
    ::-webkit-scrollbar{
     width: 6px;
  }
  ::-webkit-scrollbar-track{
     background-color: whitesmoke;
  }
  ::-webkit-scrollbar-thumb{
     background-color: #e5ded8;
  }
`;

const Header = styled.div`
   padding: 12px;
   display: flex;
   justify-content: space-between;
   border-bottom: 1px solid whitesmoke;
   position: sticky;
   top: 0;
   background-color: white;
   z-index: 100;
   background-color: whitesmoke;
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
  padding: 5px 15px;
  border-bottom: 1px solid whitesmoke;
`;

const SearchWrapper = styled.div`
  width: 100%;
  display: flex;
  background-color: whitesmoke;
  border-radius: 8px;
  height: 37px;
  padding: 4px 8px;
`;

const StyledSearchIcon = styled(SearchIcon)`
  align-self: center;
  color: gray;
  margin-right: 10px;
  font-size: 22px;
`;

const Input = styled.input`
   flex: 1;
   outline: none;
   border: none;
   background: none;
`;

const StyledButton = styled(IconButton)`
    width: 100%;
    margin: 1px 3px;
    &&&{
      font-size: 18px;
      border-radius: 3px;
    }
`;