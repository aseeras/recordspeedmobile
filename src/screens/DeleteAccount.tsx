import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { useAccountCredentials, useAccountSignOut } from "@/lib/auth/hooks";
import { deleteAccount } from "@/lib/auth/deleteAccount";
import { t } from "@/lib/i18n";

const CONFIRMATION = "DELETE";

// Permanently deletes the account after the person types DELETE, then signs them out.
export default function DeleteAccount({ whatIsDeleted }: { whatIsDeleted: string }) {
  const { data: credentials } = useAccountCredentials();
  const { mutateAsync: signOut } = useAccountSignOut();
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const confirmed = confirmation.trim().toUpperCase() === CONFIRMATION;

  async function remove() {
    if (!confirmed || deleting) return;
    setDeleting(true);
    try {
      await deleteAccount({ authToken: credentials?.authToken });
      await signOut();
      router.replace("/zero_state");
      Toast.show({ type: "success", text1: t("Your account has been deleted.") });
    } catch (error) {
      Toast.show({ type: "error", text1: t("Account not deleted"), text2: `${error.message ?? error}` });
      setDeleting(false);
    }
  }

  return (
    <>
      <View className="flex items-center mt-4">
        <Text className="text-white font-semibold text-lg">{t("Delete Account")}</Text>
      </View>

      <View className="flex items-center bg-white w-full h-full mt-4 rounded-2xl">
        <ScrollView className="w-full" keyboardShouldPersistTaps="handled">
          <View className="w-full p-6">
            <Text className="text-lg font-semibold text-gray-900 pb-3">{t("This can't be undone")}</Text>
            <Text className="text-base text-gray-700 pb-3">{t("Deleting your account permanently removes {what}. Any subscription is cancelled.", { what: t(whatIsDeleted) })}
            </Text>
            <Text className="text-base text-gray-700 pb-6">{t("Copies that people have already downloaded aren't affected.")}</Text>

            <Text className="text-base text-gray-700 pb-2.5 font-medium">{t("Type {word} to confirm", { word: CONFIRMATION })}
            </Text>
            <TextInput
              accessibilityLabel={t("Type {word} to confirm", { word: CONFIRMATION })}
              value={confirmation}
              onChangeText={setConfirmation}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!deleting}
              className="border border-gray-300 rounded-xl h-12 px-4 text-base text-gray-900"
            />

            <Pressable
              accessibilityRole="button"
              disabled={!confirmed || deleting}
              onPress={remove}
              className={`flex-row items-center justify-center rounded-xl bg-red-600 w-full h-12 mt-8 ${
                !confirmed || deleting ? "opacity-50" : ""
              }`}
            >
              {deleting && <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />}
              <Text className="text-white text-base font-semibold">
                {deleting ? "Deleting…" : "Delete my account"}
              </Text>
            </Pressable>

            {!deleting && (
              <Pressable
                className="items-center pt-5"
                onPress={() => (router.canGoBack() ? router.back() : router.replace("/home"))}
              >
                <Text className="text-indigo-700 text-base">{t("Cancel")}</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}
