import AppleSignIn from "@/components/AppleSignIn";
import Button from "@/components/Button";
import { FieldInfo, FieldWrapper, Label, TextInput } from "@/components/Field";
import GoogleSignIn from "@/components/GoogleSignIn";
import ToastPlaceholder, { Toast } from "@/components/Toast";
import { useSignIn } from "@/lib/auth/hooks";
import { SignInParams } from "@/lib/auth/request";
import { useForm } from "@tanstack/react-form";
import { Stack, useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { z } from "zod";
import Animated, { FadeInDown } from "react-native-reanimated";

function Title() {
  return (
    <>
      <View>
        <Text className="text-3xl font-bold text-ink">Hi there,</Text>
        <Text className="text-3xl font-bold text-ink">let's sign in!</Text>
      </View>
      <Text className="pt-6 text-lg text-center font-medium text-gray-700">
        You can use these
      </Text>
    </>
  );
}

function SocialLogins() {
  const router = useRouter();
  const signInMutation = useSignIn();

  async function handleSignIn(params: SignInParams) {
    const patient = await signInMutation.mutateAsync(params);
    router.dismissAll();
    setTimeout(() => {
      router.push("/home");
      Toast.show({
        type: "success",
        text1: `Welcome back ${patient.fullName}`,
      });
    }, 0);
  }

  return (
    <View className="mt-6 flex flex-row justify-around">
      <GoogleSignIn handleSubmit={handleSignIn} />
      <AppleSignIn handleSubmit={handleSignIn} />
    </View>
  );
}

function SignUpInvitation() {
  const router = useRouter();
  return (
    <View style={{ gap: 16 }}>
      <Text className="text-lg text-center font-medium text-gray-700">
        Don't have an account yet?
      </Text>
      <Button
        secondary
        text="Sign Up"
        onPress={() => {
          router.dismissAll();
          setTimeout(() => {
            router.push("/sign_up");
          }, 0);
        }}
      />
    </View>
  );
}

function SignInForm() {
  const router = useRouter();
  const signInMutation = useSignIn();
  const form = useForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirm_password: "",
    },
    async onSubmit(props) {
      const patient = await signInMutation.mutateAsync({
        email: props.value.email,
        password: props.value.password,
        registrationMethod: "internal",
        personalIdentifier: props.value.email,
        firstName: "",
        lastName: "",
      });
      router.dismissAll();
      setTimeout(() => {
        router.push("/home");
        Toast.show({
          type: "success",
          text1: `Welcome back ${patient.fullName}`,
        });
      }, 0);
    },
  });
  return (
    <View style={{ gap: 8 }}>
      <form.Field
        name="email"
        validators={{ onSubmit: z.string().email() }}
        children={(field) => (
          <FieldWrapper>
            <Label field={field}>Email</Label>
            <TextInput field={field} />
            <FieldInfo field={field} />
          </FieldWrapper>
        )}
      />

      <form.Field
        name="password"
        validators={{
          onSubmit: z.string().min(6, {
            message: "Password should have at least 6 characters",
          }),
        }}
        children={(field) => (
          <FieldWrapper>
            <Text className="text-base text-gray-700 pb-2.5 font-medium">
              Password
            </Text>
            <TextInput field={field} secureTextEntry />
            <FieldInfo field={field} />
          </FieldWrapper>
        )}
      />

      <form.Subscribe
        selector={(state) => [state.isSubmitting]}
        children={([isSubmitting]) => (
          <View className="mt-1 w-full h-12 mb-6">
            <Button
              disabled={isSubmitting}
              text={isSubmitting ? "Signing In..." : "Sign In"}
              onPress={() => form.handleSubmit()}
            />
          </View>
        )}
      />
    </View>
  );
}

export default function SignIn() {
  return (
    <View className="flex h-full bg-white px-8 pb-6">
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Animated.View entering={FadeInDown.duration(450)}>
            <Title />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(100).duration(450)}>
            <SocialLogins />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200).duration(450)}>
            <Text className="pt-6 pb-6 text-lg text-center font-medium text-gray-700">
              Or use your email and password
            </Text>
            <SignInForm />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(300).duration(450)}>
            <SignUpInvitation />
          </Animated.View>
          <Stack.Screen
            options={{
              headerStyle: { backgroundColor: "white" },
            }}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      <ToastPlaceholder />
    </View>
  );
}
