import "../global.css";
import ToastPlaceholder from "@/components/Toast";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
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
export default function AppLayout() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
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
                backgroundColor: "#10B981",
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
      </QueryClientProvider>
      <ToastPlaceholder topOffset={80} />
    </>
  );
}
