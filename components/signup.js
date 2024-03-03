import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  useColorScheme
} from "react-native";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Signup({ setLogin,setUser,setIsChatPage}) {

  const colorScheme = useColorScheme();


  //state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [span, setSpan] = useState("Already a user?");
  const [font, setFont] = useState({
    style: "flex",
    message: "white",
  });
  const [bool, setBool] = useState(true);
  //functions
  const dontDisplayKeyboard = () => {
    Keyboard.dismiss();
  };

  //submit function
  const submit = async () => {


    if (email === "" || password === "" || username === "") {
      setSpan("Please fill all fields");
      setFont({
        style: "none",
        message: "red",
      });
      setBool(false);
      window.setTimeout(() => {
        setSpan("Already a user?");
        setFont({
          style: "flex",
          message: "white",
        });
        setBool(true);
      }, 3000);
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setSpan("Invalid email");
      setFont({
        style: "none",
        message: "red",
      });
      setBool(false);
      window.setTimeout(() => {
        setSpan("Already a user?");
        setFont({
          style: "flex",
          message: "white",
        });
        setBool(true);
      }, 3000);
      return;
    }
    if (password.length < 8) {
      setSpan("8 characters minimum for password");
      setFont({
        style: "none",
        message: "red",
      });
      setBool(false);
      window.setTimeout(() => {
        setSpan("Already a user?");
        setFont({
          style: "flex",
          message: "white",
        });
        setBool(true);
      }, 3000);
      return;
    }
    if(username.length<5){
        setSpan("5 characters minimum for username");
        setFont({
            style: "none",
            message: "red",
        });
        setBool(false);
        window.setTimeout(() => {
            setSpan("Already a user?");
            setFont({
            style: "flex",
            message: "white",
            });
            setBool(true);
        }, 3000);
        return;
    }

    try{
        const res = await axios.post("/user/signup", { email, password, username });
        if (res.data.ok) {
            await AsyncStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            setIsChatPage(true);
            setEmail("");
            setPassword("");
            setUsername("");
            return;
        }
        if(!res.data.ok){
            setSpan(res.data.message);
            setFont({
                style: "none",
                message: "red",
            });
            setBool(false);
            window.setTimeout(() => {
                setSpan("Already a user?");
                setFont({
                style: "flex",
                message: "white",
                });
                setBool(true);
            }, 3000); 
            return;
        }
    }catch(e){
        console.log(e);
    }

  };

  const goToLogin = () => {
    if (bool) setLogin(true);
    
  }

  return (
    <TouchableWithoutFeedback
      style={styles.container}
      onPress={dontDisplayKeyboard}
    >
      <View style={styles.container} resizeMode="cover">
        <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
            flex: 1,
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
        }}
        keyboardVerticalOffset={Platform.OS === "ios" ? -300 : 20}
        >

        
        <TextInput
          placeholder="Username"
          placeholderTextColor="white"
          style={styles.inputStyles}
          keyboardAppearance={colorScheme==="dark"?"dark":"light"}
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="white"
          style={styles.inputStyles}
          keyboardAppearance={colorScheme==="dark"?"dark":"light"}
          value={email}
          onChangeText={(text) => setEmail(text.toLocaleLowerCase())}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="white"
          style={styles.inputStyles}
          keyboardAppearance={colorScheme==="dark"?"dark":"light"}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity 
        style={styles.span}
        onPress={goToLogin}
        >
          <Text
            style={{
              color: `${font.message}`,
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            {span}
          </Text>
          <Text
            style={{
              color: "#9171f8",
              fontSize: 15,
              fontWeight: "bold",
              display: `${font.style}`,
            }}
          >
            {" "}
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signupBtn} onPress={() => submit()}>
          <Text style={styles.signupBtnText}>Signup</Text>
        </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  fontStyles: {
    fontSize: 30,
    color: "white",
    fontFamily: "Arial",
    fontWeight: "bold",
  },
  inputStyles: {
    height: 50,
    width: "70%",
    color: "white",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    padding: 10,
    marginTop: 10,
  },
  signupBtn: {
    backgroundColor: "rgba(255,255,255,0.9)",
    color: "black",
    padding: 10,
    borderRadius: 30,
    width: 100,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 70,
  },
  signupBtnText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Arial",
  },
  span: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "Arial",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
