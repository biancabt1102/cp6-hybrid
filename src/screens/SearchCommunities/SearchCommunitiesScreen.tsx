import notifee, { EventType } from '@notifee/react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useAuth } from '../../components/AuthContext';
import { handleInvite } from '../../components/Notification';
import style from './Styles';

const SearchCommunitiesScreen = () => {
  const [communities, setCommunities] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { setCommunity, currentEmail } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('Notificação em segundo plano pressionada:', detail);
      }
    });

    const communitiesRef = firestore().collection('communities');
    const notificationsRef = firestore().collection('notification');

    const unsubscribe = communitiesRef.onSnapshot((querySnapshot) => {
      const results: any[] = [];

      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });

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

      const lowercaseEmail = currentEmail?.toLowerCase();
      results.forEach(async (result) => {
        if (result.recipient?.toLowerCase() === lowercaseEmail) {
          await handleInvite(result.title, result.body, currentEmail);
        }
      });
    });

    return () => {
      unsubscribe();
      notificationsListener();
    };
  }, [searchTerm]);

  const handleCommunityPress = (communityName: string) => {
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
