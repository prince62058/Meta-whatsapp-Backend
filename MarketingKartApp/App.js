import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {AuthProvider} from './src/context/AuthContext';
import RootNavigator from './src/navigation';
import {COLORS} from './src/theme';

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AuthProvider>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <RootNavigator />
        <Toast />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
