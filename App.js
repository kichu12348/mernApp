import { StyleSheet, ImageBackground, Image, Animated } from "react-native";
import Login from "./components/login";
import chatPage from "./components/assets/chatPage.jpg";
import Signup from "./components/signup";
import loading from "./components/assets/FloatingBot.gif";
import ChatPage from "./components/chatPage";
import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCred } from "./cryptic/ee2e";

export default function App() {
  //axios
  axios.defaults.baseURL = "https://mernappserver-m38a.onrender.com";
  axios.defaults.withCredentials = true;
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

  //state variables
  const [login, setLogin] = useState(true);
  const [isChatPage, setIsChatPage] = useState(false);
  const [run, setRun] = useState(true);
  const [user, setUser] = useState({}); //{username, email, profilePicture, contacts:[{contact:{username, email, profilePicture}}]}

  //animations
  const opacity = new Animated.Value(0);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      setRun(false);
      return;
    }
    try {
      const res = await axios.post("/user/checkAuth", { token });
      if (res.data.ok) {
        setUser(res.data.data);
        await AsyncStorage.setItem("publicKey", res.data.data.publicKey);
        const privateKey = await getCred(res.data.data.username);
        if (privateKey) {
          await AsyncStorage.setItem("privateKey", privateKey);
        }
        setIsChatPage(true);
        setRun(false);
        return;
      }
      if (!res.data.ok) {
        setRun(false);
        token ? await AsyncStorage.removeItem("token") : null;
        return;
      }
    } catch (e) {
      setRun(true);
      console.log(e);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!run) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [login, run]);

  return (
    <ImageBackground
      source={chatPage}
      style={styles.container}
      resizeMode="cover"
    >
      {run ? (
        <Image source={loading} style={{ width: 100, height: 100 }} />
      ) : (
        <Animated.View
          style={{
            height: "100%",
            width: "100%",
            opacity,
          }}
        >
          {isChatPage ? (
            <ChatPage
              setIsChatPage={setIsChatPage}
              user={user}
              setLogin={setLogin}
            />
          ) : login ? (
            <Login
              setLogin={setLogin}
              setIsChatPage={setIsChatPage}
              setUser={setUser}
            />
          ) : (
            <Signup
              setLogin={setLogin}
              setIsChatPage={setIsChatPage}
              setUser={setUser}
            />
          )}
        </Animated.View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
});
