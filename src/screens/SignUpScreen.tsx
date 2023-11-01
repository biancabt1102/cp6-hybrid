import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../components/AuthContext';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { setcurrentUser } = useAuth();

  const handleSignUp = async () => {
    try {
      // Validar os campos antes de prosseguir
      if (!email || !username || !firstName || !lastName) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos.');
        return;
      }

      setcurrentUser(username);
      const userCredential = await auth().createUserWithEmailAndPassword(email, 'password');
      const user = userCredential.user;

      // Salvar os dados do usuario no Firebase Firestore
      await firestore().collection('users').doc(user.uid).set({
        email,
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
    <View>
      <Text>Cadastro</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Nome de Usuário" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Primeiro Nome" value={firstName} onChangeText={setFirstName} />
      <TextInput placeholder="Último Nome" value={lastName} onChangeText={setLastName} />
      <Button title="Cadastrar" onPress={handleSignUp} />
    </View>
  );
};

export default SignUpScreen;
