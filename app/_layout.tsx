import "../global.css";
import ToastPlaceholder from "@/components/Toast";
import SessionGuard from "@/components/SessionGuard";
import { markActivity } from "@/lib/auth/session";
import { View } from "react-native";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import * as Updates from "expo-updates";
import { Stack } from "expo-router";
import { useCallback, useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

const queryClient = new QueryClient();
// On launch, load any newer update published with EAS Update straight away, rather than on the next launch.
function useLatestUpdate() {
  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled) return;
    (async () => {
      try {
        // Download only: the update starts the next time the app opens. Restarting straight away threw away
        // whatever the person was doing, such as a sign-in in progress or a profile save.
        const { isAvailable } = await Updates.checkForUpdateAsync();
        if (!isAvailable) return;
        await Updates.fetchUpdateAsync();
      } catch {
        // Offline or the update server is unreachable: keep running the current version.
      }
    })();
  }, []);
}

export default function AppLayout() {
  useLatestUpdate();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SessionGuard />
        {/* Any touch counts as activity for automatic sign-out (observed, never captured). */}
        <View
          style={{ flex: 1 }}
          onStartShouldSetResponderCapture={() => {
            markActivity();
            return false;
          }}
        >
        <StripeProvider
          publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
          merchantIdentifier="record-speed-mobile"
          urlScheme="record-speed-mobile"
        >
          <Stack
            screenOptions={{
              headerTitle: "",
              headerShadowVisible: false,
              headerBackVisible: false,
              headerStyle: {
                backgroundColor: "#6282EC",
              },
              // Smooth, consistent push transitions across the app.
              animation: "slide_from_right",
              animationDuration: 280,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="home" options={{ animation: "fade" }} />
            <Stack.Screen name="zero_state" options={{ animation: "fade" }} />
            <Stack.Screen name="sign_in" options={{ presentation: "modal" }} />
            <Stack.Screen name="sign_up" options={{ presentation: "modal" }} />
            <Stack.Screen name="two_factor" options={{ presentation: "modal" }} />
            <Stack.Screen name="recovery_codes" options={{ presentation: "modal", gestureEnabled: false }} />
            {/* Full screen with no native header: as an iOS sheet with the header, the bottom of the screen
                (the question box) ended up below the screen's edge. */}
            <Stack.Screen
              name="assistant"
              options={{ presentation: "fullScreenModal", headerShown: false, animation: "slide_from_bottom" }}
            />
            <Stack.Screen
              name="share_modal/[medicalRecordRequestId]"
              options={{
                presentation: "modal",
                headerStyle: {
                  backgroundColor: "transparent",
                },
                contentStyle: {
                  backgroundColor: "transparent",
                },
              }}
            />
          </Stack>
        </StripeProvider>
        </View>
      </QueryClientProvider>
      <ToastPlaceholder topOffset={80} />
    </>
  );
}
