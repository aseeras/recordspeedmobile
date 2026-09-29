import { useNavigationOptions } from "@/lib/navigation/hooks";
import Close from "@/utils/svg/Close";
import { Color } from "@/utils/svg/types";
import { printAsync } from "expo-print";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { Pressable, Text, View } from "react-native";
import Pdf from "react-native-pdf";

export function GoBack() {
  return (
    <View>
      <Pressable
        onPress={() => {
          router.replace("/home");
        }}
      >
        <Close color={Color.white} />
      </Pressable>
    </View>
  );
}

export function PrintButton({ uri }: { uri: string }) {
  return (
    <View className="w-24 flex-row">
      <Pressable
        className={`flex-row items-center justify-center rounded-md border border-white w-full h-8`}
        onPress={() => {
          printAsync({
            uri,
          });
        }}
      >
        <Text className={`text-white text-base font-medium`}>Print</Text>
      </Pressable>
    </View>
  );
}

export function ShareButton({ uri }: { uri: string }) {
  return (
    <View className="w-24 flex-row">
      <Pressable
        onPress={async function () {
          await Sharing.shareAsync(uri);
        }}
        className={`flex-row items-center justify-center rounded-md border border-white w-full h-8`}
      >
        <Text className={`text-white text-base font-medium`}>Share</Text>
      </Pressable>
    </View>
  );
}

export default function ViewPdf() {
  const { uri } = useLocalSearchParams<{
    uri?: string;
  }>();

  useNavigationOptions({
    options: {
      headerLeft: () => <GoBack />,

      headerRight: () => (
        <View style={{ gap: 16 }} className="flex-row">
          <ShareButton uri={uri} />
          <PrintButton uri={uri} />
        </View>
      ),
    },
  });

  return (
    <View className="flex flex-1">
      <Pdf
        // Cached file expires in 5 minutes
        source={{ uri, cache: true, expiration: 300 }}
        style={{
          flex: 1,
        }}
      />
    </View>
  );
}
