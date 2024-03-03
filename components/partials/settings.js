import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings({user,setIsChatPage,setLogin}) {

  async function logout() {
    await AsyncStorage.removeItem("token");
    setIsChatPage(false);
    setLogin(true);
  }



  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
      style={styles.logoutButton}
      onPress={logout}
      >
        <Text
          style={{
            fontFamily: "Arial",
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
      <View style={styles.account}>
        <Image
          style={{ height: 60, width: 60, borderRadius: 30, marginRight: 10,marginLeft: 50}}
          source={{ uri: user.profilePicture }}
        />
        <Text style={styles.fontStyles}>{user.username}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = new StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "transparent",
    position: "relative",
  },
  fontStyles: {
    fontSize: 30,
    color: "white",
    fontFamily: "Arial",
    fontWeight: "bold",
  },

  logoutButton: {
    height: 40,
    width: 100,
    borderRadius: 20,
    position: "absolute",
    bottom: 0,
    right: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "rgba(255,255,255,1)",
  },
  account: {
    height: 200,
    width: 200,
    position: "absolute",
    top: 0,
    left: 0,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  }
});
