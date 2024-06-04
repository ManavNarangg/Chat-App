import { Box, Container, TabList, TabPanel, TabPanels, Text, Tabs, Tab } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "../components/Authentication/Signup.js";
import Signup from "../components/Authentication/Login.js";
import { useNavigate } from "react-router-dom";

const HomePage = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) navigate('/chats'); 
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" color="black">
          ChitChat
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs variant="soft-rounded">
          <TabList mb={"1em"}>
            <Tab width={"50%"}>Signup</Tab>
            <Tab width={"50%"}>Login</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
