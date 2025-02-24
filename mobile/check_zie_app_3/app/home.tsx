import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Link } from "expo-router";
import { useCameraPermissions } from "expo-camera";

type RootStackParamList = {
  scanner: undefined;
  askQustion: { cid: string };
  index: undefined;
  classroom: { cid: string };
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const user = auth.currentUser;
  const [cid, setCid] = useState("");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classCode, setClassCode] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    if (!user) return;

    try {
      // ดึงข้อมูลจาก subcollection classroom ของผู้ใช้
      const querySnapshot = await getDocs(
        collection(db, `users/${user.uid}/classroom`)
      );

      // แปลงข้อมูลเป็น array
      const subjectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id, // cid
        ...doc.data(), // ข้อมูลอื่นๆ เช่น name, code, status
      }));

      setSubjects(subjectsData);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล: ", error);
    }
  };
  const addSubject = async () => {
    if (!cid || !user) {
      Alert.alert("กรุณากรอกรหัสวิชา");
      return;
    }
  
    try {
      // ตรวจสอบว่าวิชามีอยู่ใน Firestore หรือไม่
      const classRef = doc(db, 'classroom', cid);
      const classDoc = await getDoc(classRef);
  
      if (!classDoc.exists()) {
        Alert.alert("ไม่พบรหัสวิชานี้");
        return;
      }
  
      // ตรวจสอบว่าผู้ใช้ลงทะเบียนวิชานี้แล้วหรือไม่
      const userClassRef = doc(db, `users/${user.uid}/classroom/${cid}`);
      const userClassDoc = await getDoc(userClassRef);
  
      if (userClassDoc.exists()) {
        Alert.alert("คุณได้ลงทะเบียนวิชานี้แล้ว");
        return;
      }
  
      // เพิ่มผู้ใช้เข้าไปใน students subcollection ของวิชา
      await setDoc(doc(db, `classroom/${cid}/students/${user.uid}`), {
        stdid: user.uid, // ใช้ UID เป็นรหัสนักศึกษา
        name: user.displayName || "ไม่ทราบชื่อ",
      });
  
      // เพิ่มวิชาให้ผู้ใช้ พร้อมข้อมูลชื่อและรหัสวิชา
      await setDoc(doc(db, `users/${user.uid}/classroom/${cid}`), {
        status: 2,
        name: classDoc.data().info.name, // ชื่อวิชาจาก Firestore
        code: classDoc.data().info.code, // รหัสวิชาจาก Firestore
      });
  
      Alert.alert("ลงทะเบียนสำเร็จ!");
      loadSubjects();
      setCid(""); // ล้างช่องกรอก
    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาดในการลงทะเบียน");
    }
  };

  const loadClassCode = async (cid: string) => {
    const docRef = doc(db, `classroom/${cid}/info/code`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setClassCode(docSnap.data().code);
    } else {
      setClassCode(null);
    }
  };

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.navigate("index");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Student Check Zie</Text>
      <TextInput
        style={styles.input}
        placeholder="รหัสวิชา (CID)"
        value={cid}
        onChangeText={(text) => setCid(text)}
      />
      
      <Button title="เพิ่มวิชา" onPress={addSubject} />
      {classCode && (
        <Text style={styles.classCode}>Class Code: {classCode}</Text>
      )}

 {/* แสดงรายวิชา */}
 <FlatList
        data={subjects}
        renderItem={({ item }) => (
          <Pressable
          style={styles.subjectItem}
            onPress={() => navigation.navigate("classroom", { cid: item.id })}
          >
          <View style={styles.subjectItem}>
            <Text style={styles.subjectName}>รหัสวิชา: {item.id}</Text>
            <Text style={styles.subjectDetail}>ชื่อวิชา: {item.name}</Text>
            <Text style={styles.subjectDetail}>รหัส: {item.code}</Text>
            <Text style={styles.subjectDetail}>สถานะ: {item.status}</Text>
          </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
      />
      {/* <Button
        title="สแกน QR Code"
        onPress={() => navigation.navigate("scanner")}
      />
      <Pressable onPress={requestPermission}>
        <Text>Request Permission</Text>
      </Pressable>
      <Link href='/scanner'><Pressable disabled={!isPermissionGranted}>
        <Text>Scan Code</Text></Pressable></Link> */}
      <TouchableOpacity
        style={{backgroundColor: "#FF0000",padding: 10,
          borderRadius: 5,
          marginTop: 0}}
        onPress={(signOut)}
      >
        <Text style={{color:"#FFFFFF", fontSize: 20,textAlign: "center"}}>Sign Out</Text>
      </TouchableOpacity>
      {/* <Button title="Sign Out" onPress={signOut} /> */}
      {/* <Button
        title="Ask Question"
        onPress={() => navigation.navigate("askQustion", { cid })}
      /> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
  },
  classCode: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  subjectItem: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  subjectName: {
    fontSize: 16,
  },
  subjectDetail: {
    fontSize: 14,
    color: "#666",
  },
});
