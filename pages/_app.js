import '../styles/globals.css'
import {useAuthState} from 'react-firebase-hooks/auth';
import {db, auth} from '../firebase'
import Login from './login';
import Loading from '../components/Loading';
import { useEffect, useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { socket } from '../utils/socket';

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth)
  const [onlineUsers, setOnlineUsers] = useState([])

  
  useEffect(()=>{
    async function addUser(){
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        lastSeen: serverTimestamp(),
        photoURL: user.photoURL
      }, {merge: true})
     }
     if(user){
       addUser()
     }
  },[user])

  useEffect(()=>{
      user?.uid && socket.emit("newUser", user?.uid);
      
      socket.on('online', (users)=>{
          setOnlineUsers(users)
      });
  },[user?.uid])

  if(loading) return <Loading />
  if(!user) return <Login />
  

  return <Component {...pageProps} onlineUsers={onlineUsers}/>
}

export default MyApp
