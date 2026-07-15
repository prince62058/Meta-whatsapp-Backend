import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {COLORS} from '../theme';

import WhatsAppShell from '../screens/WhatsApp/WhatsAppShell';
import ChatThreadScreen from '../screens/WhatsApp/screens/ChatThreadScreen';
import CampaignCreateScreen from '../screens/WhatsApp/screens/CampaignCreateScreen';
import CampaignReportScreen from '../screens/WhatsApp/screens/CampaignReportScreen';
import TemplateCreateScreen from '../screens/WhatsApp/screens/TemplateCreateScreen';

const Stack = createStackNavigator();

export default function WhatsAppNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="WAShell" component={WhatsAppShell} />
      <Stack.Screen name="ChatThread" component={ChatThreadScreen} />
      <Stack.Screen name="CampaignCreate" component={CampaignCreateScreen} />
      <Stack.Screen name="CampaignReport" component={CampaignReportScreen} />
      <Stack.Screen name="TemplateCreate" component={TemplateCreateScreen} />
    </Stack.Navigator>
  );
}
