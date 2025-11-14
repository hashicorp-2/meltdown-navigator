import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Simple placeholder screens to test navigation
function SimpleHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.subtitle}>Navigation is working! ✅</Text>
    </View>
  );
}

function SimpleTranslatorScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Translator Screen</Text>
      <Text style={styles.subtitle}>This screen works! ✅</Text>
    </View>
  );
}

function SimpleOnboardingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding Screen</Text>
      <Text style={styles.subtitle}>This screen works! ✅</Text>
    </View>
  );
}

export type RootStackParamList = {
  Home: undefined;
  Translator: undefined;
  Onboarding: { userId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2933',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#7E9CCB',
  },
});

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
        <Stack.Screen name="Home" component={SimpleHomeScreen} />
        <Stack.Screen name="Translator" component={SimpleTranslatorScreen} />
        <Stack.Screen name="Onboarding" component={SimpleOnboardingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}





