import React from 'react'
import styled from 'styled-components'
import moment from 'moment'; 

const Message = ({message, user}) => {
  const MessageType = message.user === user ? Sender : Reciever;
  return (
    <Container>
        <MessageType>{message.message}
        <TimeStamp>
           {message.timestamp ? moment(message.timestamp.toDate()).format('LT') : '...'}
        </TimeStamp>
        </MessageType>
    </Container>
  )
}

export default Message

const Container = styled.div``;

const MessageElement = styled.p`
   width: fit-content;
   padding: 10px;
   border-radius: 7px;
   margin: 12px;
   position: relative;
   text-align: right;
   margin-left: 10px;
   min-width: 60px;
   padding-bottom: 18px;
`;

const Sender = styled(MessageElement)`
   margin-left: auto;
   background-color: #dcfBc6;
`;

const Reciever = styled(MessageElement)`
   background-color: whitesmoke;
   text-align: left;
`;

const TimeStamp = styled.span`
   color: gray;
   position: absolute;
   bottom: 2px;
   font-size: 10px;
   margin-left: 12px;
   right: 5px;
`;