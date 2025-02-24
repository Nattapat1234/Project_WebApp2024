import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRoute } from '@react-navigation/native';

interface RouteParams {
  cid: string;
}

export default function AskQuestion() {
  const user = auth.currentUser;
  const route = useRoute();
  const { cid } = route.params as RouteParams;
  const [question, setQuestion] = useState("");

  const handleSubmit = async () => {
    if (!question.trim() || !cid || !user) return;
    
    const qno = new Date().getTime(); // ใช้ timestamp เป็น id ของคำถาม
    await setDoc(doc(db, `classroom/${cid}/questions/${qno}`), {
      text: question,
      userId: user.uid,
      name: user.displayName || "นักเรียน",
      createdAt: serverTimestamp(),
    });

    Alert.alert("ส่งคำถามสำเร็จ!");
    setQuestion("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="พิมพ์คำถามของคุณ..."
        value={question}
        onChangeText={setQuestion}
      />
      <Button title="ส่งคำถาม" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});