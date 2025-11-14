import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Simple state-based navigation without React Navigation
type Screen = 'home' | 'translator' | 'onboarding';

function HomeScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.brand}>Meltdown Navigator</Text>
          <Text style={styles.tagline}>Grounded support, anywhere you need it.</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]}
            onPress={() => onNavigate('translator')}
          >
            <Text style={styles.buttonText}>Go to Translator</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={() => onNavigate('onboarding')}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Set Up Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TranslatorScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => onNavigate('home')}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.header}>
          <Text style={styles.title}>Crisis Translator</Text>
          <Text style={styles.subtitle}>Translate your feelings into clear communication</Text>
        </View>
        
        <View style={styles.placeholderBox}>
          <Text style={styles.placeholderText}>
            Translator functionality will be added here
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function OnboardingScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => onNavigate('home')}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.header}>
          <Text style={styles.title}>Onboarding</Text>
          <Text style={styles.subtitle}>Set up your profile</Text>
        </View>
        
        <View style={styles.placeholderBox}>
          <Text style={styles.placeholderText}>
            Onboarding form will be added here
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState<Screen>('home');

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />;
      case 'translator':
        return <TranslatorScreen onNavigate={handleNavigate} />;
      case 'onboarding':
        return <OnboardingScreen onNavigate={handleNavigate} />;
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <SafeAreaProvider>
      {renderScreen()}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 32,
    marginTop: 20,
  },
  brand: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7E9CCB',
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2933',
    lineHeight: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2933',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#7E9CCB',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#7E9CCB',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#7E9CCB',
  },
  backButton: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#7E9CCB',
    fontWeight: '600',
  },
  placeholderBox: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#EEF4F6',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
