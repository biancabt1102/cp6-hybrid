import notifee from '@notifee/react-native';
import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Text, View, TextInput } from 'react-native';
import { useAuth } from '../components/AuthContext';

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
              <Button title={"Convidar"} onPress={() => handleInvite(item.username)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default CommunityDetails;
