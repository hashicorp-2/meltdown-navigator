import { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen } from '@components/ui/Screen';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { createProfile, profileExists, getProfileByUserId, ProfileApiError } from '@utils/api';
import { useAppStore } from '@store/useAppStore';
import type { RootStackParamList } from '@navigation/AppNavigator';
import type {
  CreateProfileRequestDTO,
  ProfileResponseDTO,
  SupportContact,
  CommunicationTone,
} from '../../../../common/types';

type OnboardingScreenRouteProp = RouteProp<RootStackParamList, 'Onboarding'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  preferredName: string;
  supportCircle: SupportContact[];
  communicationGuidelines: {
    tone: CommunicationTone;
    doPhrases: string[];
    avoidPhrases: string[];
  };
  crisisSignals: {
    triggers: string[];
    escalationIndicators: string[];
    selfRegulationTechniques: string[];
  };
}

const INITIAL_FORM_DATA: FormData = {
  preferredName: '',
  supportCircle: [],
  communicationGuidelines: {
    tone: 'soft',
    doPhrases: [],
    avoidPhrases: [],
  },
  crisisSignals: {
    triggers: [],
    escalationIndicators: [],
    selfRegulationTechniques: [],
  },
};

const STEP_TITLES = ['Welcome', 'Support Circle', 'Communication Style', 'Crisis Signals', 'Review'];

export function OnboardingScreen() {
  const route = useRoute<OnboardingScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { userId } = route.params;
  const { setProfile } = useAppStore();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    try {
      const exists = await profileExists(userId);
      if (exists) {
        const profile = await getProfileByUserId(userId);
        setProfile(profile);
        if (profile._id) {
          await AsyncStorage.setItem('meltdown_profileId', profile._id);
        }
        navigation.replace('Translator');
      }
    } catch (err) {
      console.error('Failed to check profile:', err);
    } finally {
      setCheckingProfile(false);
    }
  };

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as Step);
      setError(null);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const payload: CreateProfileRequestDTO = {
        userId,
        preferredName: formData.preferredName,
        supportCircle: formData.supportCircle,
        communicationGuidelines: formData.communicationGuidelines,
        crisisSignals: formData.crisisSignals,
      };

      const profile = await createProfile(payload);
      
      // Store profileId for translator use
      if (profile._id) {
        await AsyncStorage.setItem('meltdown_profileId', profile._id);
      }
      
      // Update store and navigate
      setProfile(profile);
      navigation.replace('Translator');
    } catch (err) {
      const message =
        err instanceof ProfileApiError
          ? err.message
          : 'Failed to create profile. Please try again.';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.preferredName.trim().length > 0;
      case 2:
      case 3:
      case 4:
        return true; // Optional steps
      case 5:
        return !isLoading;
      default:
        return false;
    }
  };

  if (checkingProfile) {
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
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6 pt-6">
          <View>
            <Text className="text-xs uppercase tracking-[0.35em] text-indigo-400">
              Set Up Your Profile
            </Text>
            <Text className="mt-3 text-3xl font-semibold text-deep">
              {STEP_TITLES[currentStep - 1]}
            </Text>
            <Text className="mt-2 text-sm text-muted">
              Step {currentStep} of {STEP_TITLES.length}
            </Text>
          </View>

          {/* Progress indicator */}
          <View className="flex-row items-center gap-2">
            {STEP_TITLES.map((_, index) => {
              const step = (index + 1) as Step;
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;

              return (
                <View key={step} className="flex-1">
                  <View
                    className={`h-2 rounded-full ${
                      isActive || isCompleted ? 'bg-indigo-500' : 'bg-slate-200'
                    }`}
                  />
                </View>
              );
            })}
          </View>

          {/* Step content */}
          <View className="rounded-2xl bg-white p-6 shadow-sm">
            {currentStep === 1 && (
              <BasicInfoStep formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 2 && (
              <SupportCircleStep formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 3 && (
              <CommunicationStep formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 4 && (
              <CrisisSignalsStep formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 5 && <ReviewStep formData={formData} />}
          </View>

          {/* Error message */}
          {error && (
            <View className="rounded-lg bg-rose-50 p-4">
              <Text className="text-sm text-rose-600">{error}</Text>
            </View>
          )}

          {/* Navigation buttons */}
          <View className="flex-row items-center justify-between gap-4">
            <View className="flex-1">
              {currentStep > 1 && (
                <Button onPress={handlePrevious} variant="outline" disabled={isLoading}>
                  Previous
                </Button>
              )}
            </View>
            <View className="flex-1">
              {currentStep < 5 ? (
                <Button
                  onPress={handleNext}
                  disabled={!canProceed() || isLoading}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onPress={handleSubmit}
                  disabled={!canProceed() || isLoading}
                  loading={isLoading}
                >
                  Create Profile
                </Button>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

// Step 1: Basic Info
function BasicInfoStep({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <View className="gap-6">
      <View>
        <Text className="text-xl font-semibold text-deep">Welcome to Meltdown Navigator</Text>
        <Text className="mt-2 text-base text-muted">
          Let's create your personalized AI profile. This will help us provide tailored support
          during difficult moments.
        </Text>
      </View>
      <Input
        label="What should we call you?"
        placeholder="Your name"
        value={formData.preferredName}
        onChangeText={(text) => updateFormData('preferredName', text)}
        autoFocus
      />
    </View>
  );
}

// Step 2: Support Circle
function SupportCircleStep({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  const [newContact, setNewContact] = useState<SupportContact>({
    name: '',
    relationship: '',
    contactMethod: 'sms',
  });

  const addContact = () => {
    if (newContact.name.trim() && newContact.relationship.trim() && formData.supportCircle.length < 5) {
      updateFormData('supportCircle', [...formData.supportCircle, { ...newContact }]);
      setNewContact({ name: '', relationship: '', contactMethod: 'sms' });
    }
  };

  const removeContact = (index: number) => {
    updateFormData(
      'supportCircle',
      formData.supportCircle.filter((_, i) => i !== index),
    );
  };

  return (
    <View className="gap-4">
      <View>
        <Text className="text-xl font-semibold text-deep">Support Circle</Text>
        <Text className="mt-2 text-base text-muted">
          Add people in your support network (up to 5). This helps us tailor communication
          recommendations.
        </Text>
      </View>

      {formData.supportCircle.length > 0 && (
        <View className="gap-3">
          {formData.supportCircle.map((contact, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between rounded-lg bg-indigo-50 p-4"
            >
              <View>
                <Text className="font-medium text-deep">{contact.name}</Text>
                <Text className="text-sm text-muted">
                  {contact.relationship} • {contact.contactMethod}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => removeContact(index)}
                className="rounded-full bg-rose-100 px-3 py-1"
              >
                <Text className="text-sm font-medium text-rose-600">Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {formData.supportCircle.length < 5 && (
        <View className="gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <Input
            label="Name"
            placeholder="Alex"
            value={newContact.name}
            onChangeText={(text) => setNewContact({ ...newContact, name: text })}
          />
          <Input
            label="Relationship"
            placeholder="Partner, Friend, Therapist..."
            value={newContact.relationship}
            onChangeText={(text) => setNewContact({ ...newContact, relationship: text })}
          />
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-deep">Preferred Contact Method</Text>
            <View className="flex-row gap-2">
              {(['sms', 'email', 'call'] as const).map((method) => (
                <TouchableOpacity
                  key={method}
                  onPress={() => setNewContact({ ...newContact, contactMethod: method })}
                  className={`flex-1 rounded-lg border-2 px-4 py-2 ${
                    newContact.contactMethod === method
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <Text
                    className={`text-center text-sm font-medium ${
                      newContact.contactMethod === method ? 'text-indigo-600' : 'text-slate-600'
                    }`}
                  >
                    {method === 'sms' ? 'Text' : method === 'email' ? 'Email' : 'Call'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Button
            onPress={addContact}
            variant="secondary"
            disabled={!newContact.name.trim() || !newContact.relationship.trim()}
          >
            Add Contact
          </Button>
        </View>
      )}

      {formData.supportCircle.length === 0 && (
        <Text className="text-sm text-muted">You can skip this step and add contacts later.</Text>
      )}
    </View>
  );
}

// Step 3: Communication Guidelines
function CommunicationStep({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <View className="gap-6">
      <View>
        <Text className="text-xl font-semibold text-deep">Communication Style</Text>
        <Text className="mt-2 text-base text-muted">
          Help us understand how you prefer to communicate during difficult moments.
        </Text>
      </View>

      <View className="mb-4">
        <Text className="mb-2 text-sm font-medium text-deep">Communication Tone</Text>
        <View className="flex-row gap-2">
          {(['soft', 'direct', 'informative'] as const).map((tone) => (
            <TouchableOpacity
              key={tone}
              onPress={() =>
                updateFormData('communicationGuidelines', {
                  ...formData.communicationGuidelines,
                  tone,
                })
              }
              className={`flex-1 rounded-lg border-2 px-4 py-2 ${
                formData.communicationGuidelines.tone === tone
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <Text
                className={`text-center text-sm font-medium ${
                  formData.communicationGuidelines.tone === tone ? 'text-indigo-600' : 'text-slate-600'
                }`}
              >
                {tone === 'soft' ? 'Soft' : tone === 'direct' ? 'Direct' : 'Informative'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text className="text-sm text-muted">
        You can customize preferred phrases and triggers later in your profile settings.
      </Text>
    </View>
  );
}

// Step 4: Crisis Signals
function CrisisSignalsStep({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <View className="gap-6">
      <View>
        <Text className="text-xl font-semibold text-deep">Crisis Signals</Text>
        <Text className="mt-2 text-base text-muted">
          Help us recognize when you might need extra support. You can add specific triggers and
          techniques later.
        </Text>
      </View>

      <Text className="text-sm text-muted">
        For now, we'll use default settings. You can customize your triggers, escalation
        indicators, and self-regulation techniques in your profile after setup.
      </Text>
    </View>
  );
}

// Step 5: Review
function ReviewStep({ formData }: { formData: FormData }) {
  return (
    <View className="gap-6">
      <View>
        <Text className="text-xl font-semibold text-deep">Review Your Profile</Text>
        <Text className="mt-2 text-base text-muted">Please review your information before creating your profile.</Text>
      </View>

      <View className="gap-4">
        <View className="rounded-lg bg-slate-50 p-4">
          <Text className="mb-2 text-sm font-medium text-deep">Preferred Name</Text>
          <Text className="text-base text-muted">{formData.preferredName}</Text>
        </View>

        <View className="rounded-lg bg-slate-50 p-4">
          <Text className="mb-2 text-sm font-medium text-deep">Support Circle</Text>
          {formData.supportCircle.length > 0 ? (
            <View className="gap-2">
              {formData.supportCircle.map((contact, index) => (
                <Text key={index} className="text-base text-muted">
                  {contact.name} ({contact.relationship}) - {contact.contactMethod}
                </Text>
              ))}
            </View>
          ) : (
            <Text className="text-base text-muted">No contacts added</Text>
          )}
        </View>

        <View className="rounded-lg bg-slate-50 p-4">
          <Text className="mb-2 text-sm font-medium text-deep">Communication Tone</Text>
          <Text className="text-base text-muted capitalize">{formData.communicationGuidelines.tone}</Text>
        </View>
      </View>
    </View>
  );
}

