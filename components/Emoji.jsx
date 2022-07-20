import React, { useState } from 'react'
import styled from 'styled-components'
import { emojis } from '../utils/emoji'

const parsedEmojis = JSON.parse(emojis)
let emojiCat = []
parsedEmojis.forEach((e)=>{
  emojiCat.push(e.category)
})

let uniqueCats = emojiCat.filter((item, i, ar) => ar.indexOf(item) === i)

const Emoji = ({emojiChange}) => {    
  const [filtered, setFiltered] = useState(parsedEmojis)

  const handleChange = (e)=>{
    setFiltered(parsedEmojis.filter((emoji)=> emoji.description.toUpperCase().match(e.target?.value.toUpperCase())))
  }

  return (
    <Container>
        <Header>
          <Input placeholder='Search emoji' onChange={handleChange} />
        </Header>
        <EmojiContainer>
            {filtered.map((emoji, i)=>(
              <EmojiItem key={i} onClick={()=> emojiChange(emoji)}>
                {emoji.emoji}
              </EmojiItem>
            ))}
        </EmojiContainer>
    </Container>
  )
}

export default Emoji

const Container = styled.div`
    width: 300px;
    height: 300px;
    background-color: white;
    border-radius: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    height: 50px;
    width: 100%;
    position: sticky;
    top: 0;
    display: flex;
    background-color: whitesmoke;
    padding: 5px 10px;
    justify-content: center;
    align-items: center;
`;

const Input = styled.input`
    flex: 1;
    padding: 8px 12px;
    border: none;
    width: 100%;
    border-radius: 6px;
    outline: none;
    font-size: 16px;
`;

const EmojiContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  flex: 1;
  padding: 6px;
  gap: 6px;
  border-bottom-right-radius: 10px;
  justify-content: center;
  margin-bottom: 5px;
  margin-right: 1px;
`;

const EmojiItem = styled.div`
    padding: 3px;
    border-radius: 100%;
    cursor: pointer;
    font-size: 20px;
    :hover{
      background-color: whitesmoke;
    }
`;