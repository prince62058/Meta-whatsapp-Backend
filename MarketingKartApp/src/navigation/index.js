import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS} from '../theme';

// Auth
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

// Main tabs
import HomeScreen from '../screens/Home/HomeScreen';
import AdsTabScreen from '../screens/MetaAds/AdsTabScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

// WhatsApp module (has its own stack navigator)
import WhatsAppNavigator from './WhatsAppNavigator';

// Meta Ads stack screens
import AdsPageFirst from '../screens/MetaAds/AdsPageFirst';
import AdsPageSecond from '../screens/MetaAds/AdsPageSecond';
import AdsPageThird from '../screens/MetaAds/AdsPageThird';
import AdsDetails from '../screens/MetaAds/AdsDetails';
import RestartAds from '../screens/MetaAds/RestartAds';

import {useAuth} from '../context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textInactive,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: FONTS.medium,
        },
        tabBarIcon: ({color, focused}) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Ads: focused ? 'megaphone' : 'megaphone-outline',
            WhatsApp: focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Icon name={icons[route.name] || 'ellipse-outline'} size={22} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Ads" component={AdsTabScreen} options={{tabBarLabel: 'Meta Ads'}} />
      <Tab.Screen
        name="WhatsApp"
        component={WhatsAppNavigator}
        options={{tabBarLabel: 'WhatsApp'}}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      {/* Meta Ads create flow */}
      <Stack.Screen name="AdsPageFirst" component={AdsPageFirst} />
      <Stack.Screen name="AdsPageSecond" component={AdsPageSecond} />
      <Stack.Screen name="AdsPageThird" component={AdsPageThird} />
      <Stack.Screen name="AdsDetails" component={AdsDetails} />
      <Stack.Screen name="RestartAds" component={RestartAds} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const {isAuthenticated} = useAuth();
  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
