import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../components/AuthContext';
import notifee, { EventType } from '@notifee/react-native';
import { handleInvite } from '../../components/Notification';


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
    <View>
      <Text>Pesquisar Comunidades:</Text>
      <TextInput
        placeholder="Nome da Comunidade"
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
      />
      <FlatList
        data={communities}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View>
            <Button title={item.name} onPress={() => handleCommunityPress(item.name)} />
          </View>
        )}
      />
    </View>
  );
};

export default SearchCommunitiesScreen;
