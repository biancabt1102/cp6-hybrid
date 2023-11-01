import notifee, { EventType } from '@notifee/react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useAuth } from '../../components/AuthContext';
import { handleInvite } from '../../components/Notification';
import style from './Styles';


const SearchCommunitiesScreen = () => {
  const [communities, setCommunities] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { setCommunity, currentEmail } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    // Configurar o manipulador de eventos em segundo plano
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        // Lida com o evento de pressionar a notificação em segundo plano
        console.log('Notificação em segundo plano pressionada:', detail);
        // Adicione aqui qualquer ação que você deseja realizar ao pressionar a notificação em segundo plano
      }
    });

    const communitiesRef = firestore().collection('communities');
    const notificationsRef = firestore().collection('notification');

    const unsubscribe = communitiesRef.onSnapshot((querySnapshot) => {
      const results: any[] = [];

      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });

      // Filtrar comunidades com base no termo de pesquisa
      const filteredCommunities = results.filter((community) =>
        community.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setCommunities(filteredCommunities);
    });

    const notificationsListener = notificationsRef.onSnapshot(async (snapshot) => {
      const results: any[] = [];

      snapshot.forEach((doc) => {
        results.push(doc.data());
      });

      // Verifique se há novas notificações para o usuário logado
      const lowercaseEmail = currentEmail?.toLowerCase();
      results.forEach(async (result) => {
        if (result.recipient?.toLowerCase() === lowercaseEmail) {
          await handleInvite(result.title, result.body, currentEmail);
        }
      });
    });

    return () => {
      // Certifique-se de cancelar o listener quando o componente for desmontado
      unsubscribe();
      notificationsListener();
    };
  }, [searchTerm]);

  const handleCommunityPress = (communityName: string) => {
    // Navegue para a tela de detalhes da comunidade e passe a comunidade selecionada como parâmetro.
    setCommunity(communityName);
    navigation.navigate('CommunityDetails' as never);
  };

  return (
    <View style={style.body}>
      <TextInput
        placeholder="Pesquisar Comunidades 🔎"
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
        style={style.field}
      />
      <FlatList
        data={communities}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity style={style.boton} onPress={() => handleCommunityPress(item.name)}>
            <Text style={style.textBoton}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SearchCommunitiesScreen;
