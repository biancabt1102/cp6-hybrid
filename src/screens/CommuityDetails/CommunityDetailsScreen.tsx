import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../components/AuthContext';
import { handleInvite } from '../../components/Notification';
import { handleCreateNotifee } from './components/CreateNotifee';

const CommunityDetailsScreen = () => {
  const { community, currentUser, currentEmail } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const usersRef = firestore().collection('users');

    const unsubscribe = usersRef.onSnapshot((querySnapshot) => {
      const results: any[] = [];

      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });

      // Filtrar usuários com base no termo de pesquisa
      const filteredUsers = results.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setUsers(filteredUsers);
    });

    return () => {
      // Certifique-se de cancelar o listener quando o componente for desmontado
      unsubscribe();
    };
  }, [searchTerm]);
  
  const handleEnterCommunity = () => {
    const title = `Bem-Vindo a comunidade ${community}`;
    const body = `${currentUser} espero que você se divirta muito aqui 😁`;
    handleInvite(title, body, null);
    Alert.alert('Seja Bem-Vindo', 'Você entrou na comunidade ' + community + "!");
  };

  const handleNotifee = async (username : string, email : string) => {
    const title = `Olá ${username}`;
    const body = `${currentUser} convidou você para a comunidade ${community}`;
    handleCreateNotifee(email, currentUser, title, body);
    Alert.alert('Olá ' + currentUser , 'Seu convite da comunidade ' + community + ' foi enviado com sucesso para ' + username + '!');
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
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <View>
            <View>
              <Text>Username: {item.username}</Text>
              <Text>E-mail: {item.email}</Text>
            </View>
            <View>
              <Text>Nome: {item.firstName}</Text>
              <Text>Sobrenome: {item.lastName}</Text>
              {currentEmail !== item.email && (
                <Button title={"Convidar"} onPress={() => handleNotifee(item.username, item.email)} />
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default CommunityDetailsScreen;
