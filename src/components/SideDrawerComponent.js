import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "./loading";
import UserListitem from "./UserListitem";

function SideDrawerComponent() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, setselectedChat, chats, setChats } = ChatState();
  const [search, setSearch] = useState();
  const [searchresult, setSearchresult] = useState([]);

  const [loading, setLoading] = useState();
  const [loadingChat, setLoadingChat] = useState();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      alert("This field is required");
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:8000/api/users?search=${search}`,
        config
      );
      setLoading(false);
      setSearchresult(data);
    } catch (error) {
      console.log(error);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:8000/api/chats`,
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setselectedChat(data);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search users" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl"> Chat App</Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.picture}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>Profile</MenuItem>
                <MenuDivider />
              </ProfileModal>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search user"
                value={search || ""}
                name="search"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Search</Button>
            </Box>
          </DrawerBody>
          {loading === true ? (
            <Loading />
          ) : (
            <>
              {searchresult.map((item) => (
                <UserListitem
                  key={item._id}
                  user={item}
                  handleFunction={() => accessChat(item._id)}
                />
              ))}
            </>
          )}
          {loadingChat && <Spinner ml="auto" display="flex" />}
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawerComponent;
