import '../styles/globals.css'
import {useAuthState} from 'react-firebase-hooks/auth';
import {db, auth} from '../firebase'
import Login from './login';
import Loading from '../components/Loading';
import { useEffect } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth)

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

  if(loading) return <Loading />
  if(!user) return <Login />

  return <Component {...pageProps} />
}

export default MyApp
