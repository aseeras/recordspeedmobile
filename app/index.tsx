import Loader from "@/components/Loader";
import {
  useAccountCredentials,
  useSkipOnboarding,
  useStoreSkipOnboarding,
} from "@/lib/auth/hooks";
import { useUpdatePushToken } from "@/lib/notifications/hooks";
import Onboarding from "@/screens/Onboarding";
import { Redirect, router } from "expo-router";
import { View } from "react-native";

export default function Index() {
  const { data: credentials, isSuccess: isSuccessCredentials } =
    useAccountCredentials();

  const {
    isLoading: isLoadingOnboardingFlag,
    isSuccess: isSuccessOnboardingFlag,
    data: skipOnboardingFlag,
  } = useSkipOnboarding();
  const { mutate: setSkipOnboardingFlag } = useStoreSkipOnboarding();

  useUpdatePushToken();

  // Redirect declaratively: an imperative router.replace() fired from an
  // effect on the first screen can run before the root navigator is ready,
  // leaving a blank screen for returning users.
  if (skipOnboardingFlag && isSuccessCredentials) {
    // Navigate either to Home or Sign In, based on the auth token's presence
    return <Redirect href={credentials?.authToken ? "/home" : "/zero_state"} />;
  }

  return (
    <View className="bg-white h-full">
      {(isLoadingOnboardingFlag || skipOnboardingFlag) && <Loader />}

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
