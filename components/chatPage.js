import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Animated,
  Keyboard,
} from "react-native";
import Contacts from "./partials/contacts";
import SearchQuery from "./partials/searchQuery";
import Settings from "./partials/settings";
import Chats from "./partials/chats";
import chat from "./assets/chat.png";
import search from "./assets/search.png";
import settings from "./assets/settings.png";
import { useState, useEffect } from "react";

export default function ChatPage({ setIsChatPage, user, setLogin}) {
  //stateVariables
  const [isContacts, setIsContacts] = useState(true);
  const [isChat, setIsChat] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isSettings, setIsSettings] = useState(false);
  const [showNavBar, setShowNavBar] = useState("flex");
  const [chatter, setChatter] = useState({}); //{username, email, profilePicture, id, roomID}
  const [isRun, setIsRun] = useState(true);
  const [contacts, setContacts] = useState([
    {
      contact: {
        username: "BOB",
        email: "test@gmail.com",
        profilePicture: "https://api.multiavatar.com/Starcrasher.png",
        id: "",
      },
    },
  ]);

  //renderFuntions
  const navBar = () => {
    return (
      <View
        style={{
          height: "10%",
          width: "100%",
          backgroundColor: "transparent",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "flex-end",
          display: showNavBar,
        }}
      >
        <TouchableOpacity onPress={showContacts}>
          <Image source={chat} style={{ width: 40, height: 40 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={showSearch}>
          <Image source={search} style={{ width: 40, height: 40 }} />
        </TouchableOpacity>
        <Image
          source={{ uri: user.profilePicture }}
          style={{ height: 40, width: 40, marginRight: 20 }}
        />
        <TouchableOpacity onPress={showSettings}>
          <Image source={settings} style={{ width: 40, height: 40 }} />
        </TouchableOpacity>
      </View>
    );
  };

  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isContacts, isChat, isSearch, isSettings]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setShowNavBar("none");
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setShowNavBar("flex");
      }
    );

    // Cleanup listeners when component unmounts
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  //functions

  const showContacts = () => {
    setIsContacts(true);
    setIsChat(false);
    setIsSearch(false);
    setIsSettings(false);
  };

  const showChat = (contact) => {
    setChatter({
      roomID: contact.roomID,
      username: contact.username,
      profilePicture: contact.profilePicture,
    });
    setIsContacts(false);
    setIsChat(true);
    setIsSearch(false);
    setIsSettings(false);
  };

  const showSearch = () => {
    setIsContacts(false);
    setIsChat(false);
    setIsSearch(true);
    setIsSettings(false);
  };

  const showSettings = () => {
    setIsContacts(false);
    setIsChat(false);
    setIsSearch(false);
    setIsSettings(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <Animated.View
          style={{
            height: "100%",
            width: "100%",
            opacity,
          }}
        >
          {isContacts ? (
            <Contacts 
            showChat={showChat} 
            user={user} 
            contacts={contacts}
            setContacts={setContacts}
            isRun={isRun}
            setIsRun={setIsRun}
            />
          ) : isSearch ? (
            <SearchQuery 
            showContacts={showContacts}
            user={user} 
            contacts={contacts}
            setContacts={setContacts}
            />
          ) : isSettings ? (
            <Settings
              user={user}
              setIsChatPage={setIsChatPage}
              setLogin={setLogin}
            />
          ) : isChat ? (
            <Chats 
            chatter={chatter}
            user={user}
            />
          ) : null}
        </Animated.View>
      </View>

      {navBar()}
    </SafeAreaView>
  );
}

const styles = new StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  fontStyles: {
    fontSize: 30,
    color: "white",
    fontFamily: "Arial",
    fontWeight: "bold",
  },
  mainContainer: {
    height: "90%",
    width: "100%",
    backgroundColor: "transparent",
  },
});
