import { create } from 'zustand';
import type { ProfileResponseDTO } from '../../../../common/types';

interface AppState {
  hasOnboarded: boolean;
  profile: ProfileResponseDTO | null;
  setHasOnboarded: (value: boolean) => void;
  setProfile: (profile: ProfileResponseDTO | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  hasOnboarded: false,
  profile: null,
  setHasOnboarded: (value) => set({ hasOnboarded: value }),
  setProfile: (profile) => set({ profile, hasOnboarded: profile !== null }),
}));





