import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [image, setImage] = useState();
  const [loading, setloading] = useState(false);

  const postDetails = (file) => {
    setloading(true);
    if (image === "") {
      alert("Please select a picture");
    } else {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "my-chat");
      data.append("cloud_name", "dphrfzzdw");
      fetch("https://api.cloudinary.com/v1_1/dphrfzzdw/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setImage(JSON.stringify(data.url));
          setloading(false);
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
        });
    }
  };
  const submitHandler = async (data) => {
    if (!name || !email || !password) {
      return alert("please fill all the Fields");
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:8000/api/users/register",
        {
          name,
          email,
          password,
          image,
        },
        config
      );

      localStorage.setItem("user", JSON.stringify(data));
      navigate("/chats");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="first-name" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="first-name" isRequired>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          placeholder="Enter Your password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
}

export default Register;
