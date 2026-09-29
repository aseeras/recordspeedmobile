import Loader from "@/components/Loader";
import { useAccountCredentials } from "@/lib/auth/hooks";
import { Href, Redirect } from "expo-router";
import { View } from "react-native";

// "/home" has no screen of its own: send the account to its home stack.
export default function HomeIndex() {
  const { data: credentials, isSuccess } = useAccountCredentials();

  if (!isSuccess) {
    return (
      <View className="bg-white h-full">
        <Loader />
      </View>
    );
  }

  if (!credentials?.type) return <Redirect href="/zero_state" />;

  return (
    <Redirect href={`/home/${credentials.type.toLocaleLowerCase()}` as Href} />
  );
}
