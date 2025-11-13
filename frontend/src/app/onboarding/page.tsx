"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingForm } from "../../components/onboarding/OnboardingForm";
import { profileExists, getProfileByUserId } from "../../lib/api";
import type { ProfileResponseDTO } from "../../../../common/types";

// For MVP, we'll use a simple userId stored in localStorage
// In production, this would come from authentication
const getUserId = (): string => {
  if (typeof window !== "undefined") {
    let userId = localStorage.getItem("meltdown_userId");
    if (!userId) {
      userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("meltdown_userId", userId);
    }
    return userId;
  }
  return "user-anonymous";
};

export default function OnboardingPage() {
  const router = useRouter();
  const [userId] = useState(getUserId());
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [profile, setProfile] = useState<ProfileResponseDTO | null>(null);

  useEffect(() => {
    checkProfile();
  }, [userId]);

  const checkProfile = async () => {
    try {
      const exists = await profileExists(userId);
      if (exists) {
        const userProfile = await getProfileByUserId(userId);
        setProfile(userProfile);
        setHasProfile(true);
      }
    } catch (error) {
      console.error("Failed to check profile:", error);
      // If profile check fails, assume no profile exists
      setHasProfile(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = (createdProfile: ProfileResponseDTO) => {
    setProfile(createdProfile);
    setHasProfile(true);
    // Store profile ID for use in translator
    if (createdProfile._id) {
      localStorage.setItem("meltdown_profileId", createdProfile._id);
    }
    // Redirect to translator
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block size-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (hasProfile && profile) {
    // User already has a profile, redirect to translator
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-md rounded-4xl bg-white/80 p-8 shadow-2xl shadow-indigo-100 backdrop-blur-xl text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Welcome back, {profile.preferredName}!</h1>
          <p className="mt-2 text-slate-600">You already have a profile set up.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-full bg-indigo-500 px-6 py-3 text-white font-medium transition hover:bg-indigo-600"
          >
            Go to Translator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F3EEFF] via-white to-white py-12">
      <div className="mx-auto max-w-4xl px-6">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
            Set Up Your Profile
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Let's create your personalized AI profile to get the most out of Meltdown Navigator.
          </p>
        </header>
        <OnboardingForm userId={userId} onComplete={handleComplete} />
      </div>
    </div>
  );
}


