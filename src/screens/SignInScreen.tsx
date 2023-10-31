import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../components/AuthContext';

const SignInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setcurrentUser } = useAuth();

  const handleSignIn = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Voce pode fazer qualquer acao necessaria apos o login bem-sucedido aqui
      setcurrentUser(user.displayName);

      // Navegue para a tela desejada apos o login
      navigation.navigate("SearchCommunities" as never);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Entrar" onPress={handleSignIn} />
    </View>
  );
};

export default SignInScreen;
