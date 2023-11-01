import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const handleCreateNotifee = async (email: string, currentUser: string | null, title: string, body: string) => {
    try {
      const user = auth().currentUser;
      if (user) {
        // Salvar os dados da notificacao no Firebase Firestore
        await firestore().collection('notification').add({
          sender: currentUser,
          recipient: email.toLowerCase(),
          title: title,
          body: body,
          createdBy: user.uid,
        });
      } else {
        console.error('Nenhum usuário autenticado encontrado.');
      }
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
    }
  };