import { Link } from "expo-router";
import { Button, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
type RootStackParamList = {
  scanner: undefined;
  askQustion: { cid: string };
  index: undefined;
  classroom: { cid: string };
  login_email: undefined;
};

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#008000",
    padding: 10,
    borderRadius: 5,
    marginTop: 150
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 25,
  },
});

export default function Index() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View
      style={{
        flex: 1,
        
        alignItems: "center",
      }}
    >
      <Text
      style= {{
        fontSize: 30,
        color: "#000000",
        textAlign: "center",
        marginTop: 50,
        fontWeight: "bold"
      }}>Student Check Zie</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("login_email")}
      >
        <Text style={styles.buttonText}>Login With Email</Text>
      </TouchableOpacity>
      {/* <Link
        style={{ marginTop: 40, fontSize: 20, textDecorationLine: "underline" }}
        href="/login_email"
      >
        <Text>Go to login page</Text>
      </Link> */}

      {/* <Link
        style={{ marginTop: 40, fontSize: 20, textDecorationLine: "underline" }}
        href="/login_phone"
      >
        Login with Phone
      </Link> */}
      <Text
       style={{ marginTop: 100, fontSize: 15}}
      > HAVE AN ACCOUNT?</Text>
      <Link
        style={{ marginTop: 40, fontSize: 20, textDecorationLine: "underline" }}
        href="/reg_email"
      >
        Register with Email
      </Link>

      {/* <Link
        style={{ marginTop: 40, fontSize: 20, textDecorationLine: "underline" }}
        href="/reg_phone"
      >
        Register with Phone Number
      </Link> */}
    </View>
    
  );
}
