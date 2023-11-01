import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const CreateCommunityScreen = () => {
  const navigation = useNavigation();
  const [communityName, setCommunityName] = useState('');

  const handleCreateCommunity = async () => {
    try {
      // Validar os campos antes de prosseguir
      if (!communityName) {
        Alert.alert('Erro', 'Por favor, preencha o campo de nome da comunidade.');
        return;
      }

      // Verificar se a comunidade com o mesmo nome já existe
      const existingCommunity = await firestore()
        .collection('communities')
        .where('name', '==', communityName)
        .get();

      if (!existingCommunity.empty) {
        Alert.alert('Erro', 'Já existe uma comunidade com esse nome. Por favor, escolha outro nome.');
        return;
      }

      const user = auth().currentUser;
      if (user) {
        // Salvar os dados da comunidade no Firebase Firestore
        await firestore().collection('communities').add({
          name: communityName
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
