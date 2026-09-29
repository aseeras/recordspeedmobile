import { useCurrentAccount } from "@/lib/auth/hooks";
import {
  useMedicalInstitution,
  useMedicalInstitutions,
} from "@/lib/medicalInstitutions/hooks";
import { MedicalInstitution } from "@/lib/medicalInstitutions/request";
import { Patient } from "@/lib/types";
import ArrowTopRight from "@/utils/svg/ArrowTopRight";
import Search from "@/utils/svg/Search";
import { debounce } from "lodash";
import { ReactNode, useCallback, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

function MedicalInstitutionTile({
  medicalInstitution,
  onPress,
  noDivider = false,
}: {
  medicalInstitution: MedicalInstitution;
  onPress: (medicalInstitution: MedicalInstitution) => void;
  noDivider?: boolean;
}) {
  return (
    <Pressable
      className="flex flex-row items-center px-8"
      onPress={() => {
        onPress(medicalInstitution);
      }}
    >
      <View
        className={`flex flex-row items-center justify-between pr-2 py-6 ${
          noDivider ? "" : "border-b-[1px] border-gray-300"
        } w-full`}
      >
        <Text className="font-normal text-base text-gray-500 pl-2 w-64">
          {medicalInstitution.name}
        </Text>
        <ArrowTopRight />
      </View>
    </Pressable>
  );
}

function SearchMedicalInstitutionModal({
  query,
  onSelectMedicalInstitution,
  onPressOut,
}: {
  query: string;
  onSelectMedicalInstitution: (medicalInstitution: MedicalInstitution) => void;
  onPressOut: () => void;
}) {
  const { data: medicalInstitutions, isSuccess: isSuccess } =
    useMedicalInstitutions({
      query,
    });

  return (
    <Pressable
      className="absolute w-full h-full flex items-end pr-10"
      onPress={onPressOut}
    >
      <View className="bg-white absolute flex w-96 max-h-64 left-0 items-end top-14 rounded-md">
        <View className="flex bg-white w-full h-full rounded-lg shadow-2xl">
          <ScrollView className="w-full h-full my-6">
            {isSuccess &&
            medicalInstitutions &&
            medicalInstitutions.length > 0 ? (
              medicalInstitutions.map((item, index) => (
                <MedicalInstitutionTile
                  key={index}
                  medicalInstitution={item}
                  onPress={onSelectMedicalInstitution}
                  noDivider={index + 1 == medicalInstitutions.length}
                />
              ))
            ) : (
              <View className="flex flex-row w-full justify-center items-center my-6">
                <Text className="text-gray-500 text-base">
                  No results found
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Pressable>
  );
}

export default function MedicalInstitutionSearch({
  header,
  onSelectMedicalInstitution,
}: {
  header: () => ReactNode;
  onSelectMedicalInstitution: (medicalInstitution: MedicalInstitution) => void;
  initialValue?: number;
}) {
  const { data: patient } = useCurrentAccount<Patient>();
  const { data: medicalInstitutions } = useMedicalInstitutions();
  const { data: medicalInstitution } = useMedicalInstitution(
    patient.medicalInstitutionId
  );

  const [showSearchMedicalInstitutions, setShowSearchMedicalInstitutions] =
    useState(false);

  const [query, setQuery] = useState(medicalInstitution?.name ?? "");

  const [medicalInstitutionsQuery, setMedicalInstitutionsQuery] = useState("");
  const debouncedOnChangeQuery = useCallback(
    debounce((value) => {
      setMedicalInstitutionsQuery(value);
      setShowSearchMedicalInstitutions(true);
    }, 500),
    []
  );

  return (
    <>
      {header()}
      <View className="relative z-50">
        <TextInput
          value={query}
          className="border rounded-md text-base border-gray-300 text-gray-400 pl-5 pr-4 py-3"
          autoCapitalize="none"
          placeholder="Search"
          onChangeText={(text) => {
            setShowSearchMedicalInstitutions(false);
            setQuery(text);
            debouncedOnChangeQuery(text);
          }}
          onPress={() => setShowSearchMedicalInstitutions(true)}
        />
        <View className="absolute right-4 top-3.5 pt-1 pl-1 bg-white">
          <Search />
        </View>
        {showSearchMedicalInstitutions && (
          <SearchMedicalInstitutionModal
            query={medicalInstitutionsQuery}
            onSelectMedicalInstitution={(medicalInstitution) => {
              setQuery(medicalInstitution.name);
              setMedicalInstitutionsQuery(medicalInstitution.name);
              setShowSearchMedicalInstitutions(false);

              onSelectMedicalInstitution(medicalInstitution);
            }}
            onPressOut={() => {
              setShowSearchMedicalInstitutions(false);
            }}
          />
        )}
      </View>
    </>
  );
}
