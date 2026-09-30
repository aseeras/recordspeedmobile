import { View, Pressable } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { REGISTRATION_METHODS } from "@/lib/constants";
import AppleIcon from "@/utils/svg/Apple";
import { SignInParams } from "@/lib/auth/request";
import { AccountType } from "@/lib/types";

export default function AppleSignIn({
  accountType,
  handleSubmit,
}: {
  accountType?: AccountType;
  handleSubmit: (params: SignInParams) => void;
}) {
  const handleOnPress = async () => {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    handleSubmit({
      personalIdentifier: credential.user, // This is a unique ID from Apple
      password: credential.user, // Use Apple unique ID as password too in this case scenario
      email: credential.email,
      firstName: credential.fullName.givenName,
      lastName: credential.fullName.familyName,
      registrationMethod: REGISTRATION_METHODS.apple,
      type: accountType === "patient" ? "Patient" : "Attorney",
    });
  };

  return (
    <View className="w-32 h-12 rounded-xl">
      <Pressable
        className="flex items-center justify-center w-full h-full bg-white rounded-xl border-2 border-gray-100"
        onPress={handleOnPress}
      >
        <AppleIcon />
      </Pressable>
    </View>
  );
}
