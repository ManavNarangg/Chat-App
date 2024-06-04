import { useState } from "react";
import ChatBox from "../components/Miscellaneous/ChatBox";
import MyChats from "../components/Miscellaneous/MyChats";
import SideDrawer from "../components/Miscellaneous/SideDrawer";
import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetch, setFetch] = useState(false);

  return (
    <div style={{width: "100%"}}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent={"space-between"} w={"100%"} h={"91.5vh"} p="10px">
        {user && <MyChats fetch={fetch} />}
        {user && <ChatBox fetch={fetch} setFetch={setFetch} />}
      </Box>
    </div>
  );
};

export default ChatPage;
