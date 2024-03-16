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
import {getCred} from "../cryptic/ee2e";

export default function Login({ setLogin,setUser,setIsChatPage}) {

  const colorScheme = useColorScheme();

  //state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [span, setSpan] = useState("New here ?");
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
    if (email === "" || password === "") {
      setSpan("Please fill all fields");
      setFont({
        style: "none",
        message: "red",
      });
      setBool(false);
      window.setTimeout(() => {
        setSpan("New here ?");
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
        setSpan("New here ?");
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
        setSpan("New here ?");
        setFont({
          style: "flex",
          message: "white",
        });
        setBool(true);
      }, 3000);
      return;
    }
    try{
      const res = await axios.post("/user/login", { email, password })
      if (res.data.ok) {
        await AsyncStorage.setItem("token", res.data.token);
        await AsyncStorage.setItem("publicKey", res.data.user.publicKey);
        const privateKey = await getCred(res.data.user.username);
        if (privateKey) {
          await AsyncStorage.setItem("privateKey", privateKey);
        }
        await setUser(res.data.user);
        setIsChatPage(true);
      }
      if(!res.data.ok){
        setSpan(res.data.message);
        setFont({
          style: "none",
          message: "red",
        });
        setBool(false);
        window.setTimeout(() => {
          setSpan("New here ?");
          setFont({
            style: "flex",
            message: "white",
          });
          setBool(true);
        }, 3000);
      }
    }
    catch(err){
      console.log(err);
    }
    
  };

  const goToSignup = () => {
    if(bool)setLogin(false);
  }

  return (
    <TouchableWithoutFeedback
      style={styles.container}
      onPress={dontDisplayKeyboard}
    >
      <View style={styles.container} resizeMode="cover">
        <KeyboardAvoidingView behavior={
          Platform.OS === "ios" ? "padding" : "height"
        } style={{
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
        keyboardVerticalOffset={Platform.OS === "ios" ? -300 : 20}
        >

        
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
        onPress={goToSignup}
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
            Sign Up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn} onPress={() => submit()}>
          <Text style={styles.loginBtnText}>Login</Text>
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
  loginBtn: {
    backgroundColor: "rgba(255,255,255,0.9)",
    color: "black",
    padding: 10,
    borderRadius: 30,
    width: 100,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  loginBtnText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  span: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
