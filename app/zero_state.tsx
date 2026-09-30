import Button from "@/components/Button";
import Header from "@/components/Header";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import { Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import DocumentSecondary from "../assets/DocumentSecondary.png";

export default function SignIn() {
  return (
    <>
      <View className="relative flex-1 w-full h-full bg-primary-green">
        <View className="flex items-center bg-white w-full h-full mt-4 rounded-2xl">
          <Animated.View
            entering={ZoomIn.springify().damping(14)}
            style={{ width: 96, height: 96, marginRight: 24, marginTop: 160 }}
          >
            <Image
              style={{
                width: "100%",
                height: "100%",
              }}
              source={DocumentSecondary}
              contentFit="cover"
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(150).duration(500)}>
            <Text className="text-gray-900 text-center text-2xl w-80 pt-6 font-bold leading-9">
              Sign in or sign up to start your request
            </Text>
            <Text className="text-gray-500 text-center text-base w-80 pt-2 leading-6">
              Request, track and share your medical records in one place.
            </Text>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            style={{ alignSelf: "stretch", paddingHorizontal: 24, marginTop: 32, gap: 12 }}
          >
            <View style={{ flexDirection: "row" }}>
              <Button
                text="Create account"
                onPress={() => router.push("/sign_up")}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Button
                buttonStyle="secondary"
                text="Sign In"
                onPress={() => router.push("/sign_in")}
              />
            </View>
          </Animated.View>
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
