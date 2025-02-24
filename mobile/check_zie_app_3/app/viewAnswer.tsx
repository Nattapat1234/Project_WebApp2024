import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

import { RouteProp } from '@react-navigation/native';

type RouteParams = {
  params: {
    cid: string;
    qno: string;
  };
};

export default function ViewAnswers({ route }: { route: RouteProp<RouteParams, 'params'> }) {
  const { cid, qno } = route.params;
  const [answers, setAnswers] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, `classroom/${cid}/questions/${qno}/answers`), (snapshot) => {
      setAnswers(snapshot.docs.map(doc => ({ id: doc.id, text: doc.data().text || '' })));
    });

    return unsubscribe;
  }, [cid, qno]);

  return (
    <View>
      <Text>คำตอบจากครู</Text>
      <FlatList
        data={answers}
        renderItem={({ item }) => (
          <View>
            <Text>📢 {item.text}</Text>
            <Text>👨‍🏫 ครู</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
