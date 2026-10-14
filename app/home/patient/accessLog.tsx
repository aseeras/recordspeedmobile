import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { format } from "date-fns";
import { useAccessLog } from "@/lib/patient/hooks";
import { AccessLogEntry } from "@/lib/patient/request";
import { dateLocale, t } from "@/lib/i18n";

function Entry({ entry }: { entry: AccessLogEntry }) {
  const { who } = entry;
  const role = [who.role, who.organization].filter(Boolean).join(" · ");

  return (
    <View className="border-b border-gray-200 py-4">
      <View className="flex-row justify-between">
        <Text className="text-base font-semibold text-gray-900 flex-1 pr-3">
          {who.name}
        </Text>
        <Text className="text-sm text-gray-500">
          {format(new Date(entry.at), "MMM d, yyyy h:mm a", { locale: dateLocale() })}
        </Text>
      </View>
      {!!role && <Text className="text-sm text-gray-500 pt-0.5">{role}</Text>}
      <Text
        className={`text-base pt-2 ${entry.success ? "text-gray-700" : "text-red-700"}`}
      >
        {entry.description}
        {entry.count > 1 ? ` (${entry.count} times that day)` : ""}
      </Text>
      {(entry.document || entry.recordsRequestId) && (
        <Text className="text-sm text-gray-500 pt-1">
          {[
            entry.document,
            entry.recordsRequestId ? t("Request #{id}", { id: entry.recordsRequestId }) : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </Text>
      )}
    </View>
  );
}

// Who has seen my records: the patient's view of the audit trail (HIPAA right to an accounting of disclosures).
export default function HomePatientAccessLog() {
  const { data: entries, isLoading, isError, refetch, isRefetching } = useAccessLog();

  return (
    <>
      <View className="flex items-center mt-4">
        <Text className="text-white font-semibold text-lg">{t("Who has seen my records")}</Text>
      </View>

      <View className="flex items-center bg-white w-full h-full mt-4 rounded-2xl">
        <ScrollView
          className="w-full"
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        >
          <View className="w-full px-6 pt-6 pb-32">
            <Text className="text-base text-gray-700 pb-2">{t("Everyone who opened, downloaded or worked on your records in the past year, and everyone you shared them with.")}</Text>
            <Text className="text-sm text-gray-500 pb-2">{t("If something here looks wrong, contact us at contact@recordspeed.com.")}</Text>

            {isLoading && <ActivityIndicator className="pt-8" />}
            {isError && (
              <Text className="text-base text-red-700 pt-6">{t("We couldn't load this right now. Pull down to try again.")}</Text>
            )}
            {entries?.length === 0 && (
              <Text className="text-base text-gray-500 pt-6">{t("Nobody else has seen your records yet.")}</Text>
            )}
            {entries?.map((entry) => <Entry key={entry.id} entry={entry} />)}
          </View>
        </ScrollView>
      </View>
    </>
  );
}
