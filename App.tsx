import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Platform } from 'react-native';

import { initDB } from './src/database/db';
import { Colors, Radius, Shadow } from './src/theme';
import { RootStackParamList, BottomTabParamList } from './src/types';

import DashboardScreen  from './src/screens/DashboardScreen';
import HabitDetailScreen from './src/screens/HabitDetailScreen';
import AnalyticsScreen  from './src/screens/AnalyticsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<BottomTabParamList>();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = { Dashboard: '🏠', Analytics: '📊' };
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{icons[name]}</Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: '#e2e8f0',
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 80 : 62,
          ...Shadow.md,
        },
        tabBarActiveTintColor:   Colors.primary,
        tabBarInactiveTintColor: Colors.text3,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginBottom: 2 },
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Dashboard"  component={DashboardScreen}  options={{ title: 'Home' }} />
      <Tab.Screen name="Analytics"  component={AnalyticsScreen}  options={{ title: 'Analytics' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="MainTabs"    component={MainTabs} />
        <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
