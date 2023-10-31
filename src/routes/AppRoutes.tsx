import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import CreateCommunityScreen from '../screens/CreateCommunityScreen';
import SearchCommunitiesScreen from '../screens/SearchCommunitiesScreen';
import CommunityDetails from '../screens/CommunityDetails';
import Icon from 'react-native-vector-icons/AntDesign';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const SignNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#FF8A65',
      tabBarInactiveTintColor: '#C7C7C7',
      tabBarIcon: ({ color }) => {
        let iconComponent = <Icon name="login" size={30} color={color} />;

        if (route.name === 'Cadastrar') {
          iconComponent = <Icon name="adduser" size={30} color={color} />;
        }
        return iconComponent;
      },
      tabBarLabelStyle: {
        fontSize: 15,
      },
    })}
  >
      <Tab.Screen name="Login" component={SignInScreen} />
      <Tab.Screen name="Cadastrar" component={SignUpScreen} />
    </Tab.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#FF8A65',
      tabBarInactiveTintColor: '#C7C7C7',
      tabBarIcon: ({ color }) => {
        let iconComponent = <Icon name="team" size={30} color={color} />;

        if (route.name === 'Criar Comunidade') {
          iconComponent = <Icon name="addusergroup" size={30} color={color} />;
        }
        return iconComponent;
      },
      tabBarLabelStyle: {
        fontSize: 15,
      },
    })}>
      <Tab.Screen name="Procurar Comunidades" component={SearchCommunitiesScreen} />
      <Tab.Screen name="Criar Comunidade" component={CreateCommunityScreen} />
    </Tab.Navigator>
  );
};

const AppRoutes = () => {
  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{ headerShown: false}}>
        <Stack.Screen name="SignTabs" component={SignNavigator} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="CommunityDetails" component={CommunityDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppRoutes;
