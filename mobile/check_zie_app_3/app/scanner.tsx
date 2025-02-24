import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button, Platform, Linking } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { CameraView, useCameraPermissions } from "expo-camera"
import { StatusBar } from 'expo-status-bar';
export default function App() {



  return (
    <View style={styles.container}>
      <Text>QR Scanner</Text>
      {Platform.OS === "android" ? <StatusBar hidden/> : null}
      <CameraView
      style={StyleSheet.absoluteFillObject}
      facing='back'
      onBarcodeScanned={({data}) => {
        setTimeout(async()=> {
          await Linking.openURL(data);
        },500)
        
      }}/>
      
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    },
})