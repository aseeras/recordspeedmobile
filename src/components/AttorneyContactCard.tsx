import { View, Text } from "react-native";
import Avatar, { getRandomAvatarColor } from "./Avatar";
import { Contact, Patient } from "@/lib/types";
import Phone from "@/utils/svg/Phone";
import Envelope from "@/utils/svg/Envelope";
import Laptop from "@/utils/svg/Laptop";
import { useCurrentAccount } from "@/lib/auth/hooks";

export default function AttorneyContactCard({ contact }: { contact: Contact }) {
  const { data: patient } = useCurrentAccount<Patient>();

  return (
    <View className="pt-6 w-full">
      <View className="border border-gray-400 bg-white rounded-lg shadow-md p-4">
        <View className="w-full flex flex-row items-center pb-6">
          <Avatar color={getRandomAvatarColor()} />
          <View className="flex flex-col px-4">
            <Text className="text-lg font-bold text-gray-700 leading-6">
              {contact.attorney.fullName}
            </Text>
            <Text className="text-sm font-medium text-gray-700 leading-4">
              SBN: {contact.attorney.barStateNumber}
            </Text>
          </View>
        </View>

        <View className="pb-4">
          <Text className="text-base font-semibold text-gray-700">
            Hello {patient.username},{"\n"}
            Please find my contact information here.
          </Text>
        </View>

        <View
          style={{
            gap: 8,
          }}
        >
          <View className="flex flex-row items-center">
            <Phone />
            <Text className="text-base text-gray-700 pl-2">
              {contact.attorney.phone}
            </Text>
          </View>

          <View className="flex flex-row items-center">
            <Envelope />
            <Text className="text-base text-gray-700 pl-2">
              {contact.attorney.professionalEmail}
            </Text>
          </View>

          {contact.attorney.website && (
            <View className="flex flex-row items-center">
              <Laptop />
              <Text className="text-base text-gray-700 pl-2">
                {contact.attorney.website}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
