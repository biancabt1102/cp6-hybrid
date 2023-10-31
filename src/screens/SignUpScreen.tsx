import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
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
      setcurrentUser(username);
      const userCredential = await auth().createUserWithEmailAndPassword(email, 'password');
      const user = userCredential.user;

      // Salvar os dados do usuario no Firebase Firestore
      await firestore().collection('users').doc(user.uid).set({
        email,
        username,
        firstName,
        lastName,
      });

      navigation.navigate("CreateCommunity" as never);
    } catch (error) {
      console.error('Erro ao criar conta:', error);
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
