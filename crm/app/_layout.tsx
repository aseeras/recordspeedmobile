import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/auth";
import { C, Loading } from "@/ui";

// Signed out: only the sign-in screens. Signed in: the tabs and the detail screens.
function Gate() {
  const { ready, account } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const onAuthScreen = segments[0] === "sign_in" || segments[0] === "two_factor";

  useEffect(() => {
    if (!ready) return;
    if (!account && !onAuthScreen) router.replace("/sign_in");
    if (account && onAuthScreen) router.replace("/");
  }, [ready, account, onAuthScreen, router]);

  if (!ready) return <Loading />;
  return (
    <Stack screenOptions={{ headerTintColor: C.ink, headerStyle: { backgroundColor: C.bg }, headerShadowVisible: false, contentStyle: { backgroundColor: C.bg } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "Back" }} />
      <Stack.Screen name="sign_in" options={{ headerShown: false }} />
      <Stack.Screen name="two_factor" options={{ title: "Two-step sign-in" }} />
      <Stack.Screen name="deal/[id]" options={{ title: "Deal" }} />
      <Stack.Screen name="account/[id]" options={{ title: "Account" }} />
      <Stack.Screen name="project/[gid]" options={{ title: "Project" }} />
      <Stack.Screen name="new_deal" options={{ title: "New deal", presentation: "modal" }} />
      <Stack.Screen name="new_account" options={{ title: "New organization", presentation: "modal" }} />
      <Stack.Screen name="reports" options={{ title: "Sales reports" }} />
      <Stack.Screen name="demo_requests" options={{ title: "Demo requests" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 15_000, retry: 1 } } }));
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={client}>
        <AuthProvider>
          <StatusBar style="dark" />
          <Gate />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
