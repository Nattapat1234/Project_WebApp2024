import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack  screenOptions={{
      headerStyle: {
        backgroundColor: '#008000',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
      <Stack.Screen name="index" options = {{headerShown: false}} />
      <Stack.Screen name="login_email" />
      <Stack.Screen name="login_phone" />
      <Stack.Screen name="reg_email" />
      <Stack.Screen name="reg_phone" />
      <Stack.Screen name="home" options = {{headerShown: false}}/>
      <Stack.Screen name="subjects" />
      <Stack.Screen name="askQustion" />
      <Stack.Screen name="scanner" />
      <Stack.Screen name="classroom" />
    </Stack>
  );
}
