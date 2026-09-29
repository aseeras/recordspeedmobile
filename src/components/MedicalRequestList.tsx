import { View, FlatList, RefreshControl } from "react-native";
import MedicalRequestTile from "./MedicalRequestTile";
import { ReactNode } from "react";
import { MedicalRecordRequest } from "@/lib/types";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import RefreshHint from "./RefreshHint";

export default function MedicalRequestList({
  zeroState = () => <></>,
  medicalRecordRequests,
  isFetching,
  refetch,
}: {
  medicalRecordRequests: MedicalRecordRequest[];
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<MedicalRecordRequest[], Error>>;
  zeroState?: () => ReactNode;
}) {
  return (
    <>
      <View className="items-center bg-white h-full w-full ">
        {medicalRecordRequests?.length > 0 ? (
          <>
            <RefreshHint />
            <View className="pt-6 px-8 pb-28 w-full">
              <FlatList
                data={medicalRecordRequests}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View className="h-1" />}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <MedicalRequestTile medicalRecordRequest={item} />
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={isFetching}
                    onRefresh={() => refetch()}
                  />
                }
              />
            </View>
          </>
        ) : (
          zeroState()
        )}
      </View>
    </>
  );
}
