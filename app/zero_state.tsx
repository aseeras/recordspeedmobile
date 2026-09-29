import Button from "@/components/Button";
import Header from "@/components/Header";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import { Text, View } from "react-native";
import DocumentSecondary from "../assets/DocumentSecondary.png";

export default function SignIn() {
  return (
    <>
      <View className="relative flex-1 w-full h-full bg-primary-green">
        <View className="flex items-center bg-white w-full h-full mt-4 rounded-2xl">
          <View className="w-24 h-24 mr-6 mt-52">
            <Image
              style={{
                width: "100%",
                height: "100%",
              }}
              source={DocumentSecondary}
              contentFit="cover"
            />
          </View>
          <Text className="text-gray-700 text-center text-2xl w-80 pt-6 font-semibold leading-9">
            Sign in or sign up to start your request
          </Text>
          <View className="flex flex-row p-4 justify-center mt-6">
            <Button
              buttonStyle="secondary"
              text="Sign In"
              onPress={() => router.push("/sign_in")}
            />
          </View>
        </View>
        <Stack.Screen
          options={{
            header() {
              return (
                <View className="pt-24 bg-primary-green">
                  <Header onPressMenu={() => router.push("/sign_in")} />
                </View>
              );
            },
          }}
        />
      </View>
    </>
  );
}
