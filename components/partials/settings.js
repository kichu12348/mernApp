import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from 'expo-updates';

export default function Settings({user,setIsChatPage,setLogin}) {



  async function logout() {
    await AsyncStorage.removeItem("token");
    setIsChatPage(false);
    setLogin(true);
  }


  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
        return;
      }
      alert(`No updates available`);
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest update`);
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
      style={styles.logoutButton}
      onPress={logout}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
            color: "black",
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
      <TouchableOpacity
        style={styles.updateBtn}
        onPress={onFetchUpdateAsync}
      >
        <Text
        style={{
          fontWeight: "bold",
          fontSize: 20,
          color: "black",
        }}
        >
          check for updates
        </Text>
      </TouchableOpacity>
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
  },
  updateBtn: {
    height: 40,
    width: 200,
    borderRadius: 20,
    position: "absolute",
    bottom: 100,
    right: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "rgba(255,255,255,1)",
  },
});
