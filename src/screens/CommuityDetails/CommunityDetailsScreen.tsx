import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Text, TextInput, View, StyleSheet, TouchableOpacity} from 'react-native';
import { useAuth } from '../../components/AuthContext';
import { handleInvite } from '../../components/Notification';
import { handleCreateNotifee } from './components/CreateNotifee';
import style from './Styles';

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
    <View style={style.body}>
      <Text style={style.title}>Nome: {community}</Text>
      <TouchableOpacity style={style.boton} onPress={handleEnterCommunity}>
        <Text style={style.textBoton}>Entrar na Comunidade</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Pesquisar Usuários 🔎"
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
        style={style.field}
      />

      <FlatList
        data={users}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <View style={style.container}>
            <View>
              <Text style={style.form}>Username: {item.username}</Text>
              <Text style={style.form}>E-mail: {item.email}</Text>
            </View>
            <View>
              <Text style={style.form}>Nome: {item.firstName}</Text>
              <Text style={style.form}>Sobrenome: {item.lastName}</Text>
              {currentEmail === item.email ? (
                <Text style={style.currentUserText}>Você é este usuário!</Text>
              ) : currentEmail !== item.email && (
                <TouchableOpacity style={style.boton} onPress={() => handleNotifee(item.username, item.email)}>
                  <Text style={style.textBoton}>Convidar</Text>
                </TouchableOpacity>
              )}
              </View>
            </View>
          )}
        />
      </View>
    );
  };
export default CommunityDetailsScreen;
