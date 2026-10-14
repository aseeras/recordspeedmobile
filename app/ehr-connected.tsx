import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { t } from "@/lib/i18n";

// MyChart's return link normally lands back in the browser sheet that opened it. If the system opens the app with
// it instead, say what happened and go home, where the request list refreshes.
export default function EhrConnected() {
  const { status } = useLocalSearchParams<{ status?: string }>();

  useEffect(() => {
    if (status === "connected") {
      Toast.show({ type: "success", text1: t("MyChart connected"), text2: t("Your records will appear shortly.") });
    } else {
      Toast.show({ type: "error", text1: t("MyChart didn't connect"), text2: t("Please try again.") });
    }
  }, [status]);

  return <Redirect href="/home" />;
}
