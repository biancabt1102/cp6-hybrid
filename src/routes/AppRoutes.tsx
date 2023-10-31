import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignUpScreen from '../screens/SignUpScreen';
import CreateCommunityScreen from '../screens/CreateCommunityScreen';
import SearchCommunitiesScreen from '../screens/SearchCommunitiesScreen';
import CommunityDetails from '../screens/CommunityDetails';
import SignInScreen from '../screens/SignInScreen';

const Stack = createNativeStackNavigator();

const AppRoutes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="CreateCommunity" component={CreateCommunityScreen} />
        <Stack.Screen name="SearchCommunities" component={SearchCommunitiesScreen} />
        <Stack.Screen name="CommunityDetails" component={CommunityDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppRoutes;
