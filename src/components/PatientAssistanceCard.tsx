import { View, Text, Pressable } from "react-native";
import Avatar, { getRandomAvatarColor } from "./Avatar";
import { Patient } from "@/lib/types";
import Button from "./Button";
import Toast from "react-native-toast-message";
import { useCreateContact } from "@/lib/contacts/hooks";

export default function PatientAssistanceCard({
  patient,
}: {
  patient: Patient;
}) {
  const { mutateAsync: createContact } = useCreateContact();
  return (
    <View className="pt-6">
      <View className="border border-gray-400 bg-white rounded-lg shadow-md p-4">
        <View className="w-full flex flex-row items-center pb-6">
          <Avatar color={getRandomAvatarColor()} />
          <View className="flex flex-row flex-wrap pr-4">
            <Text className="text-lg font-bold px-4">{patient.username}</Text>
          </View>
        </View>

        <View className="pb-6">
          <Pressable className="px-3 bg-indigo-100 py-1.5 flex self-start rounded-md">
            <Text className="text-base">Looking for assistance</Text>
          </Pressable>
        </View>

        <View className="pb-4">
          <Text className="text-base text-gray-500">
            {patient.caseDescription ||
              "This person is looking for assistance."}
          </Text>
        </View>

        <Button
          text="Get in touch"
          onPress={() => {
            createContact({
              patientId: patient.id,
            })
              .then(() =>
                Toast.show({
                  type: "success",
                  text1: `Your contact information was successfully sent to ${patient.username}.`,
                })
              )
              .catch(() =>
                Toast.show({
                  type: "error",
                  text1: `Oops! We couldn't put you in contact whith ${patient.username}, please try again later. If the error persist please contact us at info@rec.speed.com`,
                })
              );
          }}
        />
      </View>
    </View>
  );
}
