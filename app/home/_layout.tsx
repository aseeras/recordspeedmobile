import { useState, useEffect } from "react";
import { View } from "react-native";
import MenuModal from "@/components/MenuModal";
import * as Notifications from "expo-notifications";
import Header from "@/components/Header";
import { Href, router, Slot } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAccountCredentials } from "@/lib/auth/hooks";

export default function HomeLayout() {
  const queryClient = useQueryClient();
  const { data: credentials } = useAccountCredentials();

  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const payload = response.notification.request.content.data;

        if (payload?.navigateTo) {
          router.replace(payload.navigateTo as Href);

          queryClient.clear();
        }
      });

    return () => {
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    if (!credentials) return;

    router.replace(`/home/${credentials.type.toLocaleLowerCase()}`);
  }, [credentials]);

  return (
    <>
      <View className="relative flex-1 w-full h-full bg-primary-green">
        <Header
          onPressMenu={() => {
            setShowMenu(true);
          }}
        />

        <Slot />
      </View>

      {showMenu && (
        <MenuModal
          menuType={credentials?.type}
          onCloseMenu={() => {
            setShowMenu(false);
          }}
        />
      )}
    </>
  );
}
