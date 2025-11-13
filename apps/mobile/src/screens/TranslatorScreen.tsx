import { useState, useEffect } from 'react';
import { ScrollView, View, Text, Alert, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen } from '@components/ui/Screen';
import { StressDial } from '@components/ui/StressDial';
import { TextArea } from '@components/ui/TextArea';
import { Button } from '@components/ui/Button';
import { translateMessage, TranslatorApiError } from '@utils/api';
import type { RootStackParamList } from '@navigation/AppNavigator';
import type { TranslatorResponseDTO } from '../../../../common/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function TranslatorScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [stressLevel, setStressLevel] = useState(4);
  const [rawMessage, setRawMessage] = useState('');
  const [plan, setPlan] = useState<TranslatorResponseDTO | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    // Load profileId from storage
    AsyncStorage.getItem('meltdown_profileId').then((id) => {
      if (id) {
        setProfileId(id);
      }
    });
  }, []);

  const handleTranslate = async () => {
    setErrorMessage(null);

    if (!rawMessage.trim()) {
      setErrorMessage("Share a quick note about what's happening so we can translate it.");
      return;
    }

    setIsGenerating(true);

    try {
      const livePlan = await translateMessage({
        rawMessage: rawMessage.trim(),
        stressLevel,
        profileId: profileId || undefined,
      });
      setPlan(livePlan);
    } catch (error) {
      if (error instanceof TranslatorApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("We hit a snag talking to the translator. Try again in a moment.");
      }
      Alert.alert('Translation Error', errorMessage || 'Failed to translate message');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Screen edges={['top']} className="flex-1 bg-surface">
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6 pt-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-xs uppercase tracking-[0.35em] text-indigo-400">
                Crisis Translator
              </Text>
              <Text className="mt-3 text-3xl font-semibold text-deep">
                Grounded support, step by step.
              </Text>
              <Text className="mt-4 text-base text-muted">
                Input how you're feeling and we'll craft a calm, structured plan your caregiver can
                follow.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              className="rounded-full border border-indigo-200 bg-white px-4 py-2"
            >
              <Text className="text-sm font-medium text-indigo-600">Home</Text>
            </TouchableOpacity>
          </View>

          <View className="rounded-2xl bg-white p-6 shadow-sm">
            <View className="items-center gap-6">
              <StressDial value={stressLevel} />

              <View className="w-full">
                <Text className="mb-3 text-sm font-medium text-slate-600">
                  How intense does it feel?
                </Text>
                <View className="mb-4">
                  <View className="h-2 w-full rounded-full bg-slate-200">
                    <View
                      className="h-2 rounded-full bg-indigo-500"
                      style={{ width: `${(stressLevel / 5) * 100}%` }}
                    />
                  </View>
                </View>
                <View className="flex-row items-center justify-between gap-2">
                  <TouchableOpacity
                    onPress={() => setStressLevel(Math.max(1, stressLevel - 1))}
                    className="h-10 w-10 items-center justify-center rounded-full bg-indigo-100"
                  >
                    <Text className="text-xl font-bold text-indigo-600">−</Text>
                  </TouchableOpacity>
                  <View className="flex-1 flex-row justify-between px-4">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <TouchableOpacity
                        key={level}
                        onPress={() => setStressLevel(level)}
                        className={`h-8 w-8 items-center justify-center rounded-full ${
                          stressLevel === level ? 'bg-indigo-500' : 'bg-slate-200'
                        }`}
                      >
                        <Text
                          className={`text-sm font-semibold ${
                            stressLevel === level ? 'text-white' : 'text-slate-600'
                          }`}
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity
                    onPress={() => setStressLevel(Math.min(5, stressLevel + 1))}
                    className="h-10 w-10 items-center justify-center rounded-full bg-indigo-100"
                  >
                    <Text className="text-xl font-bold text-indigo-600">+</Text>
                  </TouchableOpacity>
                </View>
                <Text className="mt-2 text-center text-sm text-slate-500">
                  Stress level {stressLevel} of 5
                </Text>
              </View>

              <TextArea
                label="Raw message"
                placeholder="Tell us what's happening…"
                value={rawMessage}
                onChangeText={setRawMessage}
                className="w-full"
              />

              {errorMessage && (
                <View className="w-full rounded-lg bg-rose-50 p-4">
                  <Text className="text-sm text-rose-600">{errorMessage}</Text>
                </View>
              )}

              <Button
                onPress={handleTranslate}
                disabled={isGenerating || !rawMessage.trim()}
                loading={isGenerating}
                className="w-full"
              >
                {isGenerating ? 'Translating…' : 'Translate to visual plan'}
              </Button>
            </View>
          </View>

          {plan && (
            <View className="rounded-2xl bg-white p-6 shadow-sm">
              <Text className="mb-4 text-lg font-semibold text-deep">Your Communication Plan</Text>
              
              <View className="mb-4 rounded-lg bg-indigo-50 p-4">
                <Text className="mb-2 text-sm font-medium text-indigo-900">
                  Communication Medium
                </Text>
                <Text className="text-base text-indigo-700">{plan.communication_medium}</Text>
              </View>

              <View className="mb-4 rounded-lg bg-sage/20 p-4">
                <Text className="mb-2 text-sm font-medium text-deep">Grounding Technique</Text>
                <Text className="text-base text-muted">{plan.grounding_technique}</Text>
              </View>

              <View className="gap-4">
                <Text className="text-base font-semibold text-deep">Steps:</Text>
                {plan.steps.map((step) => (
                  <View key={step.step_number} className="rounded-lg border border-slate-200 p-4">
                    <View className="mb-2 flex-row items-center gap-2">
                      <View className="h-6 w-6 items-center justify-center rounded-full bg-indigo-500">
                        <Text className="text-xs font-semibold text-white">{step.step_number}</Text>
                      </View>
                      <Text className="text-base font-semibold text-deep">{step.title}</Text>
                    </View>
                    <Text className="mb-2 text-base text-muted">{step.rephrased_message}</Text>
                    <View className="rounded bg-slate-50 p-2">
                      <Text className="text-xs font-medium text-slate-600">Pro tip:</Text>
                      <Text className="text-sm text-slate-700">{step.pro_tip}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

