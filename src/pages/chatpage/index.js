import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawerComponent from "../../components/SideDrawerComponent";
import MyChats from "../../components/MyChats";
import ChatBox from "../../components/ChatBox";

function ChatPage() {
  const { user } = ChatState();

  const [chats, setChats] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawerComponent />}

      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
      <p></p>
    </div>
  );
}

export default ChatPage;
