import { Link } from "expo-router";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type RootStackParamList = {
  scanner: undefined;
  askQustion: { cid: string };
  index: undefined;
  classroom: { cid: string };
  home: undefined;
};
export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        setEmail("");
        setPassword("");
        navigation.navigate("home");
      })
      .catch((error) => {
        console.log(error);
        alert("fail");
      });
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <Text 
      style={{fontSize: 30, fontWeight:"bold",margin: 40}}>Email Login</Text>
      <TextInput
        style={{
          height: 40,
          width: 200,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={{
          height: 40,
          width: 200,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 20,
        }}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
      <Button title="Login" onPress={(login) } />
    </View>
  );
}
