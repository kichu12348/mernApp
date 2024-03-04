import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  useColorScheme
} from "react-native";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function SearchQuery({user,showContacts ,setContacts,contacts}) {


    const colorScheme = useColorScheme();
  //state variables
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  

  async function search(text) { 
    setSearchQuery(text);
    const token = await AsyncStorage.getItem("token");
    if(searchQuery===""){

      setSearchResults([])
      return;
  }

   
        try {
          const response = await axios.post('/user/search',{token,searchQuery});
          if(response.data.ok){
            let searchResults = []
            response.data.data.filter(data=>data.username!==user.username)
            .map(user=>{
              searchResults.push({
                id:user._id,
                username:user.username,
                profilePicture:user.profilePicture
              })
            })
            setSearchResults(searchResults)
          }
        } catch (error) {
            console.error(error);
            setSearchResults([
            ])
        }
    
  }




  async function addContact(contactID){
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.post('/user/addContact',{token,contactID});
      if(response.data.ok){
        let contactList = []
      await response.data.contacts.filter(contact=>contact.contact?true:false)
       .map((contact) => {
         contactList.push({
            contact: {
              username: contact.contact.username,
              email: contact.contact.email,
              profilePicture: contact.contact.profilePicture,
              id: contact.contact.id,
              roomID: contact.roomID,
            },
          });
       })
        await setContacts(contactList);
        showContacts();
      }
    } catch (error) {
        console.error(error);
    }
  }



  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search"
        placeholderTextColor={"white"}
        keyboardAppearance={colorScheme === "dark" ? "dark" : "light"} 
        value={searchQuery}
        onChangeText={(text) => {
            search(text);
        }}
       
      />
      <View style={styles.searchQueryListContainer}>
        <ScrollView contentContainerStyle={styles.searchQueryList}>
          {searchResults?.map((contact, index) => (
            <TouchableOpacity 
            key={index} 
            style={styles.eachContact}
            onPress={()=>addContact(contact.id)}
            >
              <Image
                source={{ uri: contact.profilePicture }}
                style={{ height: 40, width: 40, marginRight: 20 }}
              />
              <Text style={styles.contactText}>{contact.username}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = new StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  input: {
    height: "10%",
    width: "90%",
    backgroundColor: "transparent",
    color: "white",
    fontWeight: "bold",
    borderRadius: 10,
    paddingLeft: 10,
  },
  searchQueryList: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  eachContact: {
    height: 50,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginVertical: 5,
    borderRadius: 10,
  },
  contactText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  searchQueryListContainer: {
    height: "90%",
    width: "90%",
  },
});
