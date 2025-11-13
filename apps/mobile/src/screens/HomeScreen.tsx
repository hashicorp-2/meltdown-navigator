import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Screen } from '@components/ui/Screen';
import { Button } from '@components/ui/Button';
import { useAppStore } from '@store/useAppStore';
import { profileExists, getProfileByUserId } from '@utils/api';
import type { RootStackParamList } from '@navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Generate or retrieve userId
const getUserId = async (): Promise<string> => {
  try {
    let userId = await AsyncStorage.getItem('meltdown_userId');
    if (!userId) {
      userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem('meltdown_userId', userId);
    }
    return userId;
  } catch (error) {
    // Fallback if AsyncStorage fails
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
};

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { profile, setProfile } = useAppStore();
  const [userId, setUserId] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      const id = await getUserId();
      setUserId(id);

      // Check if profile exists
      const exists = await profileExists(id);
      if (exists) {
        const userProfile = await getProfileByUserId(id);
        setProfile(userProfile);
        if (userProfile._id) {
          await AsyncStorage.setItem('meltdown_profileId', userProfile._id);
        }
      }
    } catch (error) {
      console.error('Failed to initialize user:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleStartOnboarding = () => {
    if (userId) {
      navigation.navigate('Onboarding', { userId });
    }
  };

  const handleGoToTranslator = () => {
    navigation.navigate('Translator');
  };

  if (isChecking) {
    return (
      <Screen edges={['top']} className="flex-1 items-center justify-center bg-surface">
        <Text className="text-base text-muted">Loading...</Text>
      </Screen>
    );
  }

  return (
    <Screen edges={['top']} className="flex-1 bg-surface">
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 48,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          <View className="gap-4">
            <Text className="text-xs uppercase tracking-[0.35em] text-indigo-400">
              Meltdown Navigator
            </Text>
            <Text className="text-3xl font-semibold text-deep">
              Grounded support, anywhere you need it.
            </Text>
            <Text className="text-base text-muted">
              {profile
                ? `Welcome back, ${profile.preferredName}! Ready to translate your crisis signals into clear communication.`
                : "Start by configuring your profile and inviting your support circle. We'll guide you each step of the way."}
            </Text>
          </View>

          {profile ? (
            <View className="gap-4">
              <Button onPress={handleGoToTranslator}>Go to Translator</Button>
              <Button onPress={handleStartOnboarding} variant="outline">
                Edit Profile
              </Button>
            </View>
          ) : (
            <View className="gap-4">
              <Button onPress={handleStartOnboarding}>Set Up Your Profile</Button>
              <Button onPress={handleGoToTranslator} variant="outline">
                Try Translator (No Profile)
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}





