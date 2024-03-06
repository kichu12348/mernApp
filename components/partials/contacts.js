import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";


export default function Contacts({ showChat,contacts}) {

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contactList}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {contacts?.map((contact, index) => (
            <TouchableOpacity
              key={index}
              style={styles.eachContact}
              onPress={()=>showChat(contact.contact)}
            >
              <Image
                source={{ uri: contact.contact.profilePicture }}
                style={{ height: 40, width: 40, marginRight: 20 }}
              />
              <Text style={styles.contactText}>{contact.contact.username}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
    width: "100%",
    height: "100%",
  },
  contactList: {
    flex: 1,
    width: "100%",
  },
  scrollViewContent: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  eachContact: {
    width: "90%",
    height: 50,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
  },
  contactText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  fontStyles: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
});
