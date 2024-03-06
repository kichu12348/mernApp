import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import send from "../assets/send.png";
import { useEffect, useState,useRef } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";



export default function Chats({chatter,user}) {

  const ENDPOINT ="https://mernappserver-m38a.onrender.com"
  //scoket.io
  const socket = io(ENDPOINT);

  //refs
  const scrollViewRef = useRef();
 
    //state variables
    const [inputVal, setInputVal] = useState("");
    const [messages, setMessages] = useState([]);
    const[run,setRun] = useState(true);

    //functions
    async function getMessages(){
      const token = await AsyncStorage.getItem("token");
      try {
        const response = await axios.post("/message/getMessages",{roomID:chatter.roomID,token});
        if(response.data.ok){
          await setMessages(response.data.data);
          socket.emit('joinRoom',chatter.roomID);
        }
      } catch (error) {
        console.error(error);
      }
    }

//function to send message
    const sendMessage = async () => {
      const token = await AsyncStorage.getItem("token");
      if(inputVal.trim() === "") return;
      if(inputVal[-1]=== " " || inputVal[-1] === "   ") {
        setInputVal(inputVal.trim());
      }
      setInputVal("");
      try {
        const response = await axios.post("/message/sendMessage", {
          from: user.username,
          message: inputVal,
          roomID: chatter.roomID,
          token,
        });
        socket.emit('sendMessage', {
          from: user.username,
          message: inputVal,
          roomID: chatter.roomID,
        });
        
        if (response.data.ok) {
          return;
        }
      } catch (error) {
        console.log(error);
      }
    
    }
    useEffect(()=>{
      if(run){
       getMessages(); 
       setRun(false);
      }
      
    
    },[])
    
    useEffect(() => {
      socket.on("message", (message) => {
        setMessages((prev) => [...prev, message]);
      });
    });
  
  
  
  
    return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: chatter.profilePicture }}
          style={{ height: 40, width: 40, marginRight: 20 }}
        />
        <Text style={styles.fontStyles}>{chatter.username}</Text>
      </View>
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ 
        height: "90%",
        width: "100%",
        backgroundColor: "transparent",
        justifyContent: "flex-start",
        alignItems: "center",
        flex: 1,
       }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 150 : 100}
      >

     
      <View style={styles.messages}>
        <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({animated: true})}
        >
          {messages?.map((message, index) => {
            if (message.from === user.username) {
              return (
                <View style={styles.messageRight} key={index}>
                  <View style={styles.messageTextR}>
                    <Text style={styles.messageText}>{message.message}</Text>
                  </View>
                </View>
              );
            }
            return (
              <View style={styles.messageLeft} key={index}>
                <View style={styles.messageTextL}>
                  <Text style={styles.messageText}>{message.message}</Text>
                </View>
              </View>
            );
          })}
          <View 
          style={{
            height:1,
            width:"100%",
            backgroundColor:"transparent",
          }}
          ></View>
        </ScrollView>
      </View>
      
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type in your message...."
            placeholderTextColor={"white"}
            multiline={true}
            value={inputVal}
            onChangeText={(text) => setInputVal(text)}
            style={{
              width: "90%",
              maxHeight: 80,
              fontWeight:"bold",
              color:"white",
              marginLeft: 10,
              flex: 1,
            }}
          />
          <TouchableOpacity 
          style={{
            height: 50,
            width: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={sendMessage}
          >
            <Image
            source={send}
            style={{
              height: "100%",
              width:"100%",
            }}
          />
          </TouchableOpacity>
          
        </View>
        </KeyboardAvoidingView>
    </View>
  );
}

const styles = new StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
  },
  header: {
    height: "10%",
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginLeft: 50,
    marginTop: 10,
  },
  messages: {
    height: "90%",
    width: "100%",
    backgroundColor: "transparent",
  },
  inputContainer: {
    height:80,
    width: "95%",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  fontStyles: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
  scrollViewContent: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  messageLeft: {
    minHeight: 50,
    width: "100%",
    backgroundColor: "transparent",
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  messageRight: {
    minHeight: 50,
    width: "100%",
    backgroundColor: "transparent",
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  messageTextL: {
    borderRadius: 10,
    maxHeight: "100%",
    minHeight: 30,
    minWidth: 50,
    maxWidth: "95%",
    marginLeft: 1,
    backgroundColor: "rgba(0, 255, 21, 0.7)",
    padding: 5,
  },
  messageTextR: {
    maxHeight: "100%",
    minHeight: 30,
    minWidth: 50,
    maxWidth: "95%",
    padding: 5,
    marginRight: 1,
    backgroundColor: "rgba(200, 0, 255, 0.7)",
    borderRadius: 10,
  },
  messageText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
