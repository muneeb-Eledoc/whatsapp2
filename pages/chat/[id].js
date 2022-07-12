import { collection, getDocs, getDoc, query, where, doc } from 'firebase/firestore';
import Head from 'next/head'
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import ChatScreen from '../../components/ChatScreen';
import Sidebar from '../../components/Sidebar'
import { auth, db } from '../../firebase';
import getRecipientEmail from '../../utils/getRecipientEmail';

const Chat = ({chat, messages})=>{
    const [user] = useAuthState(auth)
    const recipientEmail = getRecipientEmail(chat.users, user)
    
    return (
        <Container>
            <Head>
                <title>Chat with {recipientEmail}</title>
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chatId={chat.id} messages={messages} chat={chat} />
            </ChatContainer>
        </Container>
    )
}

export default Chat

export async function getServerSideProps(context){
    // const q = query(collection(db, 'messages'), where('chatId', '==', context.query.id))
    // const messageSnapshot = await getDocs(q)

    // let data = [];
    // messageSnapshot.forEach((message)=>{
    //     data.push({
    //         id: message.id,
    //         ...message.data()
    //     })
    // })

    const chatSnap = await getDoc(doc(db, 'chats', context.query.id))
    const chat = {
        ...chatSnap.data(),
        id: chatSnap.id
    }

    return{
        props:{
            // messages: JSON.stringify(data),
            chat: chat
        }
    }
}

const Container = styled.div`
  display: flex;

`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: auto;
  height: 100vh;
`;
