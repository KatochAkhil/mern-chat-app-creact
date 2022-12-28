import React, { useEffect, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import { getSender, getSenderFull } from "./config";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./updateGroupChat";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

function SingleChat({ fetchAgain, setFetchAgain }) {
  const ENDPOINT = "http://localhost:8000";

  let socket, selectedChatCompare;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessages, setNewMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIstyping] = useState(false);
  const { user, selectedChat, setSelcetedChat } = ChatState();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      setTyping(true);
    });
    socket.on("stop Typing", () => {
      setTyping(false);
    });
  });

  const fetchMessage = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setNewMessages("");
      const { data } = await axios.get(
        `http://localhost:8000/api/messages/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert("error");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recived", (newMessagesRecived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessagesRecived.chat._id
      ) {
        //give notifications
      } else {
        setMessages([...messages, newMessagesRecived]);
      }
    });
  });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessages) {
      socket.emit("stop Typing", selectedChat._id);
      try {
        setLoading(true);
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessages("");
        const { data } = await axios.post(
          `http://localhost:8000/api/messages`,
          {
            content: newMessages,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setLoading(false);
      } catch (error) {
        alert("Error");
        console.log(error);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessages(e.target.value);

    // typing indicator logic

    // if (!socketConnected) {
    //   return alert("socket not connected");
    // }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();

      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop Typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelcetedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessage={fetchMessage}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? <div>Loading...</div> : <></>}
              <Input
                placeholder="Enter a Message..."
                bg="#E0E0E0"
                onChange={typingHandler}
                value={newMessages}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            h="100%"
          >
            <Text fontSize="3xl" pb={3}>
              Click on a user to start chatting
            </Text>
          </Box>
        </>
      )}
    </>
  );
}

export default SingleChat;
