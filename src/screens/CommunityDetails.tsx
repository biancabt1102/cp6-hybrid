import notifee from '@notifee/react-native';
import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Text, View, TextInput } from 'react-native';
import { useAuth } from '../components/AuthContext';
import auth from '@react-native-firebase/auth';

const CommunityDetails = () => {
  const { community, currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = firestore().collection('users');
      const querySnapshot = await usersRef.get();
      const results: any[] = [];

      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });

      // Filtrar usuarios com base no termo de pesquisa
      const filteredUsers = results.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setUsers(filteredUsers);
    };

    fetchUsers();
  }, [searchTerm]);

  const handleInvite = async (username: string) => {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'users',
      name: 'usuarios'
    });

    await notifee.displayNotification({
      title: `Olá ${username}`,
      body: `${currentUser} convidou você para a comunidade ${community}`,
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      }
    });
  };

  const handleEnterCommunity = () => {
    Alert.alert('Seja Bem-Vindo', 'Você entrou na comunidade ' + community + "!");
  };

  const handleCreateNotifee = async (username: string, email: string) => {
    try {
      const user = auth().currentUser;
      if (user) {
        // Salvar os dados da notificacao no Firebase Firestore
        await firestore().collection('notification').add({
          sender: currentUser,
          recipient: email,
          title: `Olá ${username}`,
          body: `${currentUser} convidou você para a comunidade ${community}`,
          createdBy: user.uid,
        });
        Alert.alert('Olá ' + currentUser , 'Seu convite da comunidade ' + community + ' foi enviado com sucesso para ' + username + '!');
      } else {
        console.error('Nenhum usuário autenticado encontrado.');
      }
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
    }
  };

  return (
    <View>
      <Text>Detalhes da Comunidade: {community}</Text>
      <Button title="Entrar na Comunidade" onPress={handleEnterCommunity} />

      {/* Campo de pesquisa para filtrar usuarios */}
      <Text>Pesquisar Usuários:</Text>
      <TextInput
        placeholder="Nome do Usuário"
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
      />

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <View>
              <Text>Username: {item.username}</Text>
              <Text>E-mail: {item.email}</Text>
            </View>
            <View>
              <Text>Nome: {item.firstName}</Text>
              <Text>Sobrenome: {item.lastName}</Text>
              <Button title={"Convidar"} key={item.id} onPress={() => handleCreateNotifee(item.username, item.email)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default CommunityDetails;
