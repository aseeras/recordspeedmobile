import { useEffect } from "react";
import { router } from "expo-router";
import { useAccountSignOut } from "@/lib/auth/hooks";
import { View } from "react-native";
import Loader from "@/components/Loader";

export default function HomeLayout() {
  const { mutate: signOut } = useAccountSignOut();

  useEffect(() => {
    signOut();
    router.replace("/zero_state");
  }, []);

  return (
    <View className="bg-white h-full">
      <Loader />
    </View>
  );
}
