import {
  Platform,
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useForm } from "@tanstack/react-form";
import Button from "@/components/Button";
import Toast from "react-native-toast-message";
import { useAccountCredentials } from "@/lib/auth/hooks";
import { shareMedicalRecordRequest } from "@/lib/medicalRecordRequests/request";
import { FieldInfo, FieldWrapper } from "@/components/Field";
import { useSharedWithMeMedicalRecordRequests } from "@/lib/medicalRecordRequests/hooks";

export default function ShareMedicalRecordModal() {
  const { refetch } = useSharedWithMeMedicalRecordRequests();
  const { data: credentials } = useAccountCredentials();
  const { medicalRecordRequestId } = useLocalSearchParams();

  const form = useForm({
    defaultValues: {
      username: "",
    },
    onSubmit: ({ value }) => {
      shareMedicalRecordRequest({
        authToken: credentials?.authToken,
        medicalRecordRequestId: parseInt(medicalRecordRequestId.toString()),
        recipientUsername: value.username,
      }).then((response) => {
        const isSuccessful = response.statusCode == 200;

        refetch();

        // Navigate back to home
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/home");
        }

        Toast.show({
          type: isSuccessful ? "success" : "error",
          text1: isSuccessful
            ? "Your medical record request has been shared successfully."
            : response.statusMessage,
        });
      });
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex bg-white p-8 items-center rounded-t-2xl justify-start mt-auto h-full">
        {/* Native modals have dark backgrounds on iOS. Set the status bar to light content and add a fallback for other platforms with auto. */}
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />

        <Text className="font-semibold text-2xl w-full text-gray-700 text-center">
          Share Your Medical Records
        </Text>

        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) => {
              return !value ? "A Record Speed Handle is required." : undefined;
            },
          }}
          children={(field) => (
            <FieldWrapper className="w-full pt-8">
              <TextInput
                value={field.state.value}
                className="border rounded-md text-base border-gray-300 text-gray-400 pl-5 pr-4 py-3"
                autoCapitalize="none"
                placeholder="Record Speed Handle"
                onChangeText={(text) => {
                  field.handleChange(text);
                }}
              />
              <View className="mt-2">
                <FieldInfo field={field} />
              </View>
            </FieldWrapper>
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <>
              <View className="mt-1 w-full h-12 mb-2">
                <Button
                  buttonStyle={!canSubmit ? "disabled" : "primary"}
                  text={isSubmitting ? "Sharing..." : "Share"}
                  onPress={() => {
                    // Trigger form submit
                    form.handleSubmit();
                  }}
                />
              </View>
              <View className="mt-1 w-full h-12">
                <Button
                  buttonStyle="secondary"
                  text="Cancel"
                  onPress={() => {
                    if (router.canGoBack()) {
                      router.back();
                    } else {
                      router.replace("/home");
                    }
                  }}
                />
              </View>
            </>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
