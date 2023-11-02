import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../components/AuthContext';
import style from './Styles';


const SignUpScreen = () => {
  const navigation = useNavigation();
  let [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { setcurrentUser } = useAuth();

  const handleSignUp = async () => {
    try {

      if (!email || !username || !firstName || !lastName) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos.');
        return;
      }

      setcurrentUser(username);
      const userCredential = await auth().createUserWithEmailAndPassword(email, 'password');
      const user = userCredential.user;

      await firestore().collection('users').doc(user.uid).set({
        email: email.toLowerCase(),
        username,
        firstName,
        lastName,
        displayName: username,
      });

      navigation.navigate("Login" as never);
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar o usuário.\n' + error);
    }
  };

  return (
    <ScrollView >
      <View style={style.body}>
        <TextInput style={style.field} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={style.field} placeholder="Nome de Usuário" value={username} onChangeText={setUsername} />
        <TextInput style={style.field} placeholder="Primeiro Nome" value={firstName} onChangeText={setFirstName} />
        <TextInput style={style.field} placeholder="Último Nome" value={lastName} onChangeText={setLastName} />
        <TouchableOpacity style={style.boton} onPress={handleSignUp}>
          <Text style={style.textBoton}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;
