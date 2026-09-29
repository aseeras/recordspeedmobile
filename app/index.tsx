import Loader from "@/components/Loader";
import {
  useAccountCredentials,
  useSkipOnboarding,
  useStoreSkipOnboarding,
} from "@/lib/auth/hooks";
import { useUpdatePushToken } from "@/lib/notifications/hooks";
import Onboarding from "@/screens/Onboarding";
import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function Index() {
  const { data: credentials } = useAccountCredentials();

  const {
    isLoading: isLoadingOnboardingFlag,
    isSuccess: isSuccessOnboardingFlag,
    data: skipOnboardingFlag,
  } = useSkipOnboarding();
  const { mutate: setSkipOnboardingFlag } = useStoreSkipOnboarding();

  useUpdatePushToken();

  useEffect(() => {
    if (!skipOnboardingFlag) return;
    // Navigate either to Home or Sign In, based on patient token's presence
    credentials?.authToken
      ? router.replace("/home")
      : router.replace("/zero_state");
  }, [skipOnboardingFlag, credentials?.authToken]);

  return (
    <View className="bg-white h-full">
      {isLoadingOnboardingFlag && <Loader />}

      {isSuccessOnboardingFlag && !skipOnboardingFlag && (
        <Onboarding
          onFinish={() => {
            setSkipOnboardingFlag(true);

            // Navigate to Sign In
            router.replace("/zero_state");
          }}
        />
      )}
    </View>
  );
}
