import ContactList from "@/components/ContactList";
import { View, Text } from "react-native";
import { t } from "@/lib/i18n";

export default function HomeContacts() {
  return (
    <>
      <View className="flex items-center mt-12">
        <Text className="text-white font-semibold text-lg">{t("Contacts")}</Text>
      </View>

      <View className="flex items-center bg-white w-full h-full mt-4 rounded-2xl">
        <ContactList
          zeroState={() => <Text className="pt-6">{t("Nothing to see here!")}</Text>}
        />
      </View>
    </>
  );
}
