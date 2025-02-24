import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Button } from "react-native";
import { useRoute } from "@react-navigation/native";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useCameraPermissions } from "expo-camera";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type RouteParams = {
  cid: string;
};
type RootStackParamList = {
    scanner: undefined;
    askQustion: { cid: string };
    index: undefined;
    classroom: { cid: string };
  };

export default function ClassroomScreen() {
  const route = useRoute();
  const { cid } = route.params as RouteParams; // รับ cid จาก route.params
  const [classroom, setClassroom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
    const isPermissionGranted = Boolean(permission?.granted);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    

  // ดึงข้อมูลวิชาจาก Firestore
  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const classRef = doc(db, "classroom", cid);
        const classDoc = await getDoc(classRef);

        if (classDoc.exists()) {
          setClassroom(classDoc.data()); // เซ็ตข้อมูลวิชา
        } else {
          console.log("ไม่พบข้อมูลวิชา");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล: ", error);
      } finally {
        setLoading(false); // หยุด loading
      }
    };

    fetchClassroom();
  }, [cid]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!classroom) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>ไม่พบข้อมูลวิชา</Text>
        <Button
              title="เช็คชื่อ"
              onPress={() => navigation.navigate("scanner")}
            />  
            <Text
            style={{
                marginTop: 10
            }}></Text>
            <Button
                    title="ติดต่อสอบถาม"
                    onPress={() => navigation.navigate("askQustion", { cid })}
                  />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>รายละเอียดวิชา</Text>
      <Text style={styles.detail}>รหัสวิชา: {cid}</Text>
      <Text style={styles.detail}>ชื่อวิชา: {classroom.info.name}</Text>
      <Text style={styles.detail}>รหัส: {classroom.info.code}</Text>
      <Text style={styles.detail}>ห้องเรียน: {classroom.info.room}</Text>
      <Text style={styles.detail}>ผู้สอน: {classroom.info.owner}</Text>
      <Button
              title="เช็คชื่อ"
              onPress={() => navigation.navigate("scanner")}
            />  
            <Text
            style={{
                marginTop: 50
            }}></Text>
        <Button
                title="ติดต่อสอบถาม"
                onPress={() => navigation.navigate("askQustion", { cid })}
              />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});