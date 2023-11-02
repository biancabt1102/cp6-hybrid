import notifee from '@notifee/react-native';
import firestore from '@react-native-firebase/firestore';

export const handleInvite = async (title: string, body: string, email: string | null) => {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'users',
    name: 'usuarios'
  });

  await notifee.displayNotification({
    title: title,
    body: body,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    }
  });

  if (email != null) {
    const lowercaseEmail = email?.toLowerCase();
    const notificationRef = firestore().collection('notification').where('recipient', '==', lowercaseEmail);

    await notificationRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });
  }
};