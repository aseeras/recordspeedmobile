import { useCurrentAccount } from "@/lib/auth/hooks";
import { Patient } from "@/lib/types";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import DocumentSecondary from "../../assets/DocumentSecondary.png";
import { t } from "@/lib/i18n";

// Centered in the space above the Ask and + buttons (pb-32 keeps it clear of them).
export default function HomeZeroState() {
  const { data: patient } = useCurrentAccount<Patient>();
  return (
    <View className="flex-1 w-full items-center justify-center px-10 pb-32">
      <View className="w-24 h-24 rounded-full bg-indigo-50 items-center justify-center">
        <Image
          style={{ width: 52, height: 52, marginRight: 8 }}
          source={DocumentSecondary}
          contentFit="contain"
        />
      </View>
      <Text className="text-gray-900 text-center text-2xl font-bold pt-6">{t("Welcome,")}{" "}{patient ? patient.fullName : "Patient"}
      </Text>
      <Text className="text-gray-500 text-center text-base leading-6 pt-2">{t("You don't have any medical requests yet.")}</Text>
      <Text className="text-gray-500 text-center text-base leading-6 pt-4">{t("Tap the")}{" "}<Text className="font-bold text-primary-green">+</Text>{" "}{t("button below to start your first one.")}</Text>
    </View>
  );
}
