import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../components/AuthContext';

const CreateCommunityScreen = () => {
  const navigation = useNavigation();
  const { setCommunity } = useAuth();
  const [communityName, setCommunityName] = useState('');

  const handleCreateCommunity = async () => {
    try {
      setCommunity(communityName);
      const user = auth().currentUser;
      if (user) {
        // Salvar os dados da comunidade no Firebase Firestore
        await firestore().collection('communities').add({
          name: communityName,
          createdBy: user.uid,
        });

        navigation.navigate("Procurar Comunidades" as never);
      } else {
        console.error('Nenhum usuário autenticado encontrado.');
      }
    } catch (error) {
      console.error('Erro ao criar comunidade:', error);
    }
  };

  return (
    <View>
      <Text>Criar Comunidade</Text>
      <TextInput placeholder="Nome da Comunidade" value={communityName} onChangeText={setCommunityName} />
      <Button title="Criar Comunidade" onPress={handleCreateCommunity} />
    </View>
  );
};

export default CreateCommunityScreen;
