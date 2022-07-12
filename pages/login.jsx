import { Button } from "@mui/material";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Head from "next/head";
import styled from "styled-components"
import {auth, provider} from '../firebase'
const Login = () => {

  const signin = ()=>{
    signInWithPopup(auth, provider)
    .then((result)=>{

    }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  }
  return (
    <Container>
        <Head>
            <title>Login</title>
            <link rel="icon" href="/favicon.png" />
        </Head>

        <LoginContainer>
            <Logo src='https://img.icons8.com/color/48/000000/whatsapp--v1.png' />
            <Button variant='contained' onClick={signin}>Sign In With Google</Button>
       </LoginContainer>
    </Container>
  )
}

export default Login

const Container = styled.div`
  display: grid;
  height: 100vh;
  place-items: center;
  width: 100%;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: white;
  padding: 50px 30px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const Logo = styled.img`
    width: 50px;
    height: 50px;
    margin: 10px 0px;
`;
