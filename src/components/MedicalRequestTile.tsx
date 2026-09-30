import { Text, View, Pressable } from "react-native";
import { useMedicalInstitutions } from "@/lib/medicalInstitutions/hooks";
import { format, parse } from "date-fns";
import Badge from "@/components/Badge";
import Check from "@/utils/svg/Check";
import Lock from "@/utils/svg/Lock";
import User from "@/utils/svg/User";
import { Link, router, useRouter } from "expo-router";
import { MedicalRecordRequest, MedicalRecordRequestStatus } from "@/lib/types";
import { useCurrentAccount } from "@/lib/auth/hooks";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function MedicalRequestTile({
  medicalRecordRequest,
}: {
  medicalRecordRequest: MedicalRecordRequest;
}) {
  const { data: currentAccount } = useCurrentAccount();
  const router = useRouter();
  const medicalInstitutions = useMedicalInstitutions();
  const createdAt = medicalRecordRequest.createdAt;
  const isFulfilled =
    medicalRecordRequest.status.toString() ==
    MedicalRecordRequestStatus[MedicalRecordRequestStatus.fulfilled];

  return (
    <View className="w-full bg-white mb-5 p-5 rounded-2xl border border-gray-100 shadow-lg shadow-gray-300/40">
      <View className={`${isFulfilled ? "pb-2" : "pb-6"}`}>
        <Text className="text-base text-gray-700 font-semibold">
          {isFulfilled ? (
            <>
              Certified By{" "}
              <View className="pl-1 pb-0.5">
                <Check />
              </View>
            </>
          ) : (
            "Medical institution"
          )}
        </Text>

        <Text className="text-base text-gray-700 font-normal">
          {medicalInstitutions.data &&
            medicalInstitutions.data.find(
              (item) => item.id == medicalRecordRequest.medicalInstitutionId
            ).name}
        </Text>

        {medicalRecordRequest.sharingPatient && (
          <>
            <Text className="text-base text-gray-700 font-semibold pt-2">
              Shared By{" "}
              <View className="pl-1 pb-0.5 pt-3">
                <User color="blue" />
              </View>
            </Text>
            <View
              className={`flex flex-row flex-wrap items-center w-full justify-start mb-4`}
            >
              <Text className="text-base text-gray-700 font-normal pr-2">
                {medicalRecordRequest.sharingPatient.fullName}
              </Text>
              <Text className=" text-sm text-gray-700">
                {format(
                  parse(
                    medicalRecordRequest.sharedAt,
                    "yyyy-MM-dd",
                    new Date()
                  ),
                  "MMMM dd, yyyy"
                )}
              </Text>
            </View>
          </>
        )}
      </View>

      <View
        className={`flex flex-row flex-wrap items-center w-full ${
          isFulfilled ? "justify-start mb-4" : "justify-between"
        }`}
      >
        <View className="pr-2">
          <Badge type={medicalRecordRequest.status.toString()} />
        </View>
        <Text className=" text-sm text-gray-700">
          {format(createdAt, "MMMM dd, yyyy")}
        </Text>
      </View>

      {isFulfilled &&
        medicalRecordRequest.documents &&
        medicalRecordRequest.documents.map((document) => (
          <View className="pt-4" key={document.id}>
            <View className={`py-4 px-5 rounded-xl bg-indigo-50`}>
              <Text className={`text-base text-indigo-700 pb-4`}>
                {document.filename}
              </Text>
              {currentAccount.type === "Attorney" && (
                <View className="items-end">
                  <Pressable
                    onPress={() => {
                      if (document.purchased) {
                        router.push(
                          `/view_pdf?uri=${process.env.EXPO_PUBLIC_API_BASE_URL}${document.url}`
                        );
                      } else {
                        router.push(
                          `/home/attorney/${medicalRecordRequest.id}/${document.id}`
                        );
                      }
                    }}
                    className="bg-white rounded-lg shadow-sm px-4 py-2 flex-row items-center"
                  >
                    {!document.purchased && (
                      <View className="h-6 mr-2">
                        <Lock />
                      </View>
                    )}
                    <Text className="text-indigo-700 text-base font-medium">
                      Read
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        ))}

      {isFulfilled && !medicalRecordRequest.sharingPatient && (
        <View className="pt-6">
          <Pressable
            className={`flex-row items-center justify-center rounded-xl bg-indigo-600 w-full h-11`}
            onPress={() => {
              router.push(`/share_modal/${medicalRecordRequest.id}`);
            }}
          >
            <Text className={`text-white text-base font-semibold`}>
              Share
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
