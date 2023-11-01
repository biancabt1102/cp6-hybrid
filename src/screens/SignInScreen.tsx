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

  useEffect(() => {
    // Crie um listener para escutar por mudanças em todas as notificações
    const notificationsRef = firestore().collection('notification');
    const notificationsListener = notificationsRef.onSnapshot(async (snapshot) => {
      const results: any[] = [];
      
      snapshot.forEach((doc) => {
        results.push(doc.data());
      });  
      
      console.log(results)
      setNotifications(results);

      // Verifique se há novas notificações para o usuário logado
      const lowercaseEmail = email?.toLowerCase();
      results.forEach(results => {
        if (results.recipient?.toLowerCase() === lowercaseEmail) {
          handleInvite(results.title, results.body);
        }
      });
      
    });

    // Remova o listener quando o componente for desmontado
    return () => notificationsListener();
  }, []);

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

      // Navegue para a tela desejada após o login
      navigation.navigate("MainTabs" as never);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

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

    // Agora, você pode excluir a notificação do Firestore
    const lowercaseEmail = email?.toLowerCase();
    const notificationRef = firestore().collection('notification').where('recipient', '==', lowercaseEmail);

    notificationRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete(); // Exclua o documento do Firestore
      });
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
