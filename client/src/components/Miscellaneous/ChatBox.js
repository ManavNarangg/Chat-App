import React from 'react'
import { Box } from '@chakra-ui/react';
import { ChatState } from '../../context/ChatProvider';
import SingleChat from '../SingleChat';

const ChatBox = ({ fetch, setFetch }) => {

  const { selectedChat } = ChatState();
  
  return (
    <Box d={{ base: selectedChat ? "flex": "none", md: "flex" }}
    alignItems={"center"}
    flexDir={"column"}
    bg={"white"}
    p={3}
    w={{ base: "100%", md: "68%" }}
    borderRadius={"lg"}
    borderWidth={"1px"}
    >
      <SingleChat fetch={fetch} setFetch={setFetch}/> 
    </Box>
  )
}

export default ChatBox