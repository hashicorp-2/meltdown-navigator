import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo } from 'react';

import { HomeScreen } from '@screens/HomeScreen';
import { TranslatorScreen } from '@screens/TranslatorScreen';
import { OnboardingScreen } from '@screens/OnboardingScreen';

export type RootStackParamList = {
  Home: undefined;
  Translator: undefined;
  Onboarding: { userId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const navigationTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: '#F7F9FC',
        primary: '#7E9CCB',
        text: '#1F2933',
        card: '#FFFFFF',
        border: '#EEF4F6',
        notification: '#FF6B6B',
      },
    }),
    [],
  );

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F7F9FC' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Translator" component={TranslatorScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}





