import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, Text, TextInput, View, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import { useAuth } from '../../components/AuthContext';
import style from './Styles';

const SignInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const { setcurrentUser, setcurrentEmail } = useAuth();

  const handleSignIn = async () => {
    try {
      if (!email) {
        Alert.alert('Erro', 'Por favor, preencha o campo com seu e-mail.');
        return;
      }

      const userCredential = await auth().signInWithEmailAndPassword(email, 'password');
      const user = userCredential.user;

      // Recupere os dados do usuário do Firebase Firestore
      const userDoc = await firestore().collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const username = userData?.username;
        const email = user.email;
        setcurrentUser(username);
        setcurrentEmail(email)
      }

      // Navegue para a tela desejada após o login
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Communities' }],
        })
      );
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login.\n' + error);
    }
  };

  return (
    <View style={style.body}>
      <TextInput style={style.field} placeholder="Email" value={email} onChangeText={setEmail} />
      <TouchableOpacity style={style.boton} onPress={handleSignIn}>
        <Text style={style.textBoton}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInScreen;
