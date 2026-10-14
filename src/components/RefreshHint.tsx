import { View, Text } from "react-native";
import Refresh from "@/utils/svg/Refresh";
import { t } from "@/lib/i18n";

export default function RefreshHint() {
  return (
    <View className="flex flex-row">
      <Refresh />
      <Text className="text-gray-600 text-xs pl-2">{t("Pull down to refresh")}</Text>
    </View>
  );
}
