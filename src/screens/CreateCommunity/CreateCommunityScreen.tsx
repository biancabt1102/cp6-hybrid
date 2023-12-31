import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import style from './Styles';

const CreateCommunityScreen = () => {
  const navigation = useNavigation();
  const [communityName, setCommunityName] = useState('');

  const handleCreateCommunity = async () => {
    try {
      if (!communityName) {
        Alert.alert('Erro', 'Por favor, preencha o campo de nome da comunidade.');
        return;
      }

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
        await firestore().collection('communities').add({
          name: communityName
        });

        setCommunityName('');
        navigation.navigate("Procurar Comunidades" as never);
      } else {
        console.error('Nenhum usuário autenticado encontrado.');
      }
    } catch (error) {
      console.error('Erro ao criar comunidade:', error);
    }
  };

  return (
    <View style={style.body}>
      <TextInput
        placeholder="Nome da Comunidade"
        value={communityName}
        onChangeText={setCommunityName}
        style={style.field}
      />
      <TouchableOpacity style={style.boton} onPress={handleCreateCommunity}>
        <Text style={style.textBoton}>Criar Comunidade</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateCommunityScreen;
