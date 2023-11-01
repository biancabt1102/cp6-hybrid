import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import AppRoutes from "./src/routes/AppRoutes";
import { AuthProvider } from "./src/components/AuthContext";
//import AppRoutes from "./src/routes/AppRoutes";


function App() {
  return (
    <SafeAreaView style={style.screen}>
      <StatusBar />
      <AuthProvider>
        <AppRoutes/>
      </AuthProvider>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default App;