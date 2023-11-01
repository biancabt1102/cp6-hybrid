import React, { useState, useEffect } from 'react';
import notifee from '@notifee/react-native';
import { View, Text, TextInput, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../components/AuthContext';

type Notification = {
  title: string;
  body: string;
  recipient: string;
  sender: string;
};

const SignInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const { setcurrentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]); // Array de notificações

  const handleSignIn = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, 'password');
      const user = userCredential.user;

      // Recupere os dados do usuário do Firebase Firestore
      const userDoc = await firestore().collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const username = userData?.username;
        const email = user.email;
        setcurrentUser(username);
      }

      await fetchNotifications();

      const lowercaseEmail = email.toLowerCase();
      notifications.forEach(notification => {
        if (notification.recipient.toLowerCase() === lowercaseEmail) {
          handleInvite(notification.title, notification.body);
        }
      });

      // Navegue para a tela desejada após o login
      navigation.navigate("MainTabs" as never);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const fetchNotifications = async () => {
    const notificationsRef = firestore().collection('notification');
    const querySnapshot = await notificationsRef.get();
    const results: any[] = [];

    querySnapshot.forEach((doc) => {
      results.push(doc.data());
    });

    setNotifications(results);
    console.log(results);
  }

  const handleInvite = async (title: string, body: string) => {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'users',
      name: 'usuarios'
    });

    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      }
    });
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <Button title="Entrar" onPress={handleSignIn} />
    </View>
  );
};

export default SignInScreen;
