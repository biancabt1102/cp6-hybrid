import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../components/AuthContext';

const SearchCommunitiesScreen = () => {
  const [communities, setCommunities] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { setCommunity } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCommunities = async () => {
      const communitiesRef = firestore().collection('communities');
      const querySnapshot = await communitiesRef.get();
      const results: any[] = [];

      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });

      // Filtrar comunidades com base no termo de pesquisa
      const filteredCommunities = results.filter((community) =>
        community.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setCommunities(filteredCommunities);
    };

    fetchCommunities();
  }, [searchTerm]);

  const handleCommunityPress = (communityName : string) => {
    // Navegue para a tela de detalhes da comunidade e passe a comunidade selecionada como parametro.
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
        keyExtractor={(item) => item.createdBy}
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
