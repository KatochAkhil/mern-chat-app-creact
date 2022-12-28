import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { getSender } from "./config";
import GroopChatModal from "./GroopChatModal";
import Loading from "./loading";

function MyChats({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setselectedChat, user, chats, setChats } = ChatState();
  const [loading, setLoading] = useState();

  const fetchChats = async () => {
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:8000/api/chats`,
        config
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      
      setChats(data);
      setLoading(false);
    } catch (error) {
      alert("Something Went Wrong");
      console.log(error);
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroopChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroopChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setselectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <>
            <Loading />
          </>
        )}
      </Box>
    </Box>
  );
}

export default MyChats;
