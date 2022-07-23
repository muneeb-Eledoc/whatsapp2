import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const Gifs = ({setGif, gif, sendMessage}) => {
    const [gifs, setGifs] = useState([])
    useEffect(() => {
        async function getGifs(){
          const res = await fetch('https://whatsapp-ivory.vercel.app/api/gifs')
          const json = await res.json();
          setGifs(json.gifs)
        }
        getGifs()
       },[])

  return (
    <Container>
        <Wrapper>
        {gif && <StyledKeyboardBackspaceIcon onClick={()=> setGif('')} />}
              {gif && <StyledIconButton onClick={sendMessage}>
          <SendIcon  />
        </StyledIconButton>}
        {gif ? <Image  src={'/gifs/'+gif} width={280} height={250} alt='gif' /> : gifs?.map(g=>(
            <StyledImage key={g} src={'/gifs/'+g} width={50} height={50} alt='gif' onClick={()=> setGif(g)}/>
        ))}
   
        </Wrapper>
    </Container>
  )
}

export default Gifs

const Container = styled.div`
    position: absolute;
    left: 3px;
    bottom: 68px;
    border-radius: 10px;
    background-color: white;
    width: 300px;
    height: 300px;
    overflow-y: auto;
`;

const Wrapper = styled.div`
    position: relative;
    padding: 15px 3px; 
    gap: 6px;
    display: flex;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
`;

const StyledIconButton = styled(IconButton)`
 &&&{
     position: absolute;
     right: 4px;
     bottom: -15px;
 }
`;

const StyledKeyboardBackspaceIcon = styled(KeyboardBackspaceIcon)`
    position: absolute;
    top: 5px;
    left: 8px;
    cursor: pointer;
    z-index: 999;
`;
const StyledImage = styled(Image)`
    border-radius: 10px;
    background-color: whitesmoke;
    cursor: pointer;
    &&&{
        object-fit: cover;
    }
`;