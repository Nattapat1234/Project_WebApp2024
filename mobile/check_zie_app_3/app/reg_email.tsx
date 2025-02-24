
import {auth,db} from "../firebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Button, TextInput, View,  StyleSheet} from "react-native";
import { doc, setDoc } from "firebase/firestore";

export default function RegEmailScreen() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const signUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
    
            // Store user information in Firestore
            await setDoc(doc(db, "users", user.uid), {
              email: user.email,
              name: name,
              photo: "", // Placeholder for photo
                
            });
    
            // Clear TextInput
            setEmail('');
            setPassword('');
            setName('');

            alert("ลงทะเบียนสำเร็จ!");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
          });
      };

      return (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />
          <Button title="Sign Up" onPress={signUp} />
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      },
      input: {
        height: 40,
        width: 200,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
      },
    });