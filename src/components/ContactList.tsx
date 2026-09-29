import { View, FlatList, RefreshControl } from "react-native";
import { ReactNode } from "react";
import AttorneyContactCard from "./AttorneyContactCard";
import { usePatientContacts } from "@/lib/contacts/hooks";
import RefreshHint from "./RefreshHint";

export default function ContactList({
  zeroState = () => <></>,
}: {
  zeroState?: () => ReactNode;
}) {
  const { data: contacts, isFetching, refetch } = usePatientContacts();

  return (
    <>
      <View className="flex items-center bg-white w-full h-full mt-4 rounded-2xl">
        {contacts?.length > 0 ? (
          <>
            <RefreshHint />
            <View className="pt-2 px-6 pb-52 w-full h-full">
              <FlatList
                data={contacts}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View className="h-1" />}
                renderItem={({ item }) => (
                  <AttorneyContactCard contact={item} />
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
