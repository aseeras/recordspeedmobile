import { View, Pressable } from "react-native";
import { REGISTRATION_METHODS } from "@/lib/constants";
import GoogleIcon from "@/utils/svg/Google";
import { useGoogleAuth } from "@/lib/auth/hooks";
import { SignInParams } from "@/lib/auth/request";
import { AccountType } from "@/lib/types";

const iOSClientID = process.env.EXPO_PUBLIC_IOS_OAUTH_CLIENT_ID;
const androidClientID = process.env.EXPO_PUBLIC_ANDROID_OAUTH_CLIENT_ID;

export default function GoogleSignIn({
  accountType,
  handleSubmit,
}: {
  accountType?: AccountType;
  handleSubmit: (params: SignInParams) => void;
}) {
  const googleAuth = useGoogleAuth({
    iosClientId: iOSClientID,
    androidClientId: androidClientID,
    handleResponse: (accessToken) => {
      getUserInfo(accessToken);
    },
  });

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userInfo = await response.json();
      handleSubmit({
        personalIdentifier: userInfo.id, // This is a unique ID from Google
        password: userInfo.id, // Use Google unique ID as password too in this case scenario
        email: userInfo.email,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        registrationMethod: REGISTRATION_METHODS.google,
        type:
          accountType === undefined
            ? undefined
            : accountType === "patient"
            ? "Patient"
            : "Attorney",
      });
    } catch (error) {} // here you can handle errors
  };

  return (
    <View className="w-32 h-12 rounded-md">
      <Pressable
        className="flex items-center justify-center w-full h-full bg-white rounded-md shadow-xl"
        onPress={() => {
          googleAuth.mutate();
        }}
      >
        <GoogleIcon />
      </Pressable>
    </View>
  );
}
