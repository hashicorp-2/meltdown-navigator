# Meltdown Navigator Mobile App

React Native mobile application built with Expo for iOS and Android.

## Features

- ✅ **Translator Screen** - Translate crisis signals into clear communication plans
- ✅ **Onboarding Flow** - Multi-step profile creation
- ✅ **Profile Management** - Create and manage AI profiles
- ✅ **API Integration** - Full integration with backend services

## Setup

1. **Install dependencies:**
   ```bash
   npm install --workspace @meltdown/mobile
   ```

2. **Configure backend URL:**
   - Create a `.env` file in `apps/mobile/` (optional)
   - Set `EXPO_PUBLIC_BACKEND_URL=http://localhost:4000` (or your backend URL)
   - Defaults to `http://localhost:4000` if not set

3. **Start the development server:**
   ```bash
   npm run start --workspace @meltdown/mobile
   ```

4. **Run on device/simulator:**
   - iOS: `npm run ios --workspace @meltdown/mobile`
   - Android: `npm run android --workspace @meltdown/mobile`

## App Structure

```
src/
├── components/
│   └── ui/          # Reusable UI components (Button, Input, etc.)
├── navigation/       # Navigation setup
├── screens/          # Screen components
│   ├── HomeScreen.tsx
│   ├── TranslatorScreen.tsx
│   └── OnboardingScreen.tsx
├── store/            # Zustand state management
└── utils/            # Utilities (API client, etc.)
```

## Navigation Flow

1. **Home Screen** - Entry point, checks for existing profile
2. **Onboarding Screen** - Multi-step profile creation (5 steps)
3. **Translator Screen** - Main feature for translating crisis messages

## API Integration

The app uses the same backend API as the web app:
- Profile CRUD operations
- Crisis translator endpoint
- Profile personalization support

All API calls are in `src/utils/api.ts`.

## Dependencies

- **Expo** - React Native framework
- **React Navigation** - Navigation library
- **NativeWind** - Tailwind CSS for React Native
- **Zustand** - State management
- **AsyncStorage** - Local storage for userId and profileId

## Notes

- The app uses AsyncStorage to persist userId and profileId
- Profile data is stored in Zustand store for app-wide access
- Backend URL can be configured via environment variable


