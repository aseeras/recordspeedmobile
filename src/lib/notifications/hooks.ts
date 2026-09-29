import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { AppState } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Platform } from "react-native";
import { useAccountCredentials } from "../auth/hooks";
import { patchPatient } from "../patient/request";
import { AccountType } from "../types";
import { patchAttorney } from "../attorneys/request";

export function usePushToken() {
  return useQuery({
    queryFn: registerForPushNotificationsAsync,
    queryKey: ["pushToken"],
  });
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      throw new Error(
        "Permission not granted to get push token for push notification!"
      );
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      throw new Error("Project ID not found");
    }

    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    return pushTokenString;
  } else {
    throw new Error("Must use physical device for push notifications");
  }
}

export function useAppStateVisible() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  });

  return appStateVisible;
}

export function useUpdatePushToken() {
  const appStateVisible = useAppStateVisible();
  const { data: pushNotificationToken } = usePushToken();
  const { data: credentials } = useAccountCredentials();

  const updatePushtokenMutation = useMutation({
    mutationFn: function ({
      pushToken,
      accountType,
    }: {
      pushToken: string;
      accountType: AccountType;
    }) {
      switch (accountType) {
        case "patient":
          return patchPatient({
            patient: { pushToken },
            authToken: credentials?.authToken,
          });

        case "attorney":
          return patchAttorney({
            attorney: { pushToken },
            authToken: credentials?.authToken,
          });
      }
    },
  });

  useEffect(
    function updatePushNotificationToken() {
      if (appStateVisible !== "active") return;
      if (!credentials?.authToken) return;
      if (!pushNotificationToken) return;

      updatePushtokenMutation.mutate({
        pushToken: pushNotificationToken,
        accountType: credentials.type,
      });
    },
    [appStateVisible, credentials?.authToken, pushNotificationToken]
  );
}
