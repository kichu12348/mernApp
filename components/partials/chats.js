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
  Keyboard,
} from "react-native";
import send from "../assets/send.png";
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function Chats() {
  const test =
    "In the heart of the bustling city, where the symphony of car horns and the rhythm of footsteps create a cacophony of urban life, there exists a vibrant tapestry of diversity and ambition. Skyscrapers soar into the sky, their glass facades reflecting the dreams and aspirations of a multitude of individuals navigating the concrete canyons below. Streets lined with cafes and boutiques beckon the curious wanderer, promising a sensory journey through the fusion of cultures and flavors. As the sun sets, the cityscape transforms into a mesmerizing display of lights, each twinkling luminescence telling a story of innovation and progress. Amidst the hustle and bustle, hidden pockets of tranquility reveal themselves—a quiet park where the rustle of leaves harmonizes with distant laughter, or a historic alleyway where time seems to stand still. This city, with its contradictions and harmonies, serves as a microcosm of human existence—a testament to the boundless possibilities and complexities that define our shared journey on this remarkable planet.";
    const[value, setValue] = useState("")
    const [inputVal, setInputVal] = useState("");
    const store = async () => {
      try {
        await AsyncStorage.setItem('chat', inputVal)
        await AsyncStorage.getItem('chat').then((value) => {
          setValue(value)
        })
      } catch (e) {
        console.log(e)
      }

    }
  
  
  
  
  
    return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: "https://api.multiavatar.com/Starcrasher.png" }}
          style={{ height: 40, width: 40, marginRight: 20 }}
        />
        <Text style={styles.fontStyles}>Kichu</Text>
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 140 : 0}
      >

     
      <View style={styles.messages}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.messageLeft}>
            <View style={styles.messageTextL}>
              <Text style={styles.messageText}>{test}</Text>
            </View>
          </View>
          <View style={styles.messageRight}>
            <View style={styles.messageTextR}>
              <Text style={styles.messageText}>{value}</Text>
            </View>
          </View>
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
              fontFamily:"Arial",
              fontWeight:"bold",
              color:"white",
              marginLeft: 10,
              flex: 1,
            }}
          />
          <TouchableOpacity 
          onPress={()=>store("hi")}
          style={{
            height: 50,
            width: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
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
    fontFamily: "Arial",
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
