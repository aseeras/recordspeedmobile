import Button from "@/components/Button";
import DropdownInput from "@/components/DropdownInput";
import { FieldInfo, FieldWrapper, Label, TextInput } from "@/components/Field";
import RadioButton from "@/components/RadioButton";
import { useUpdateAttorney } from "@/lib/attorneys/hooks";
import { useCurrentAccount } from "@/lib/auth/hooks";
import {
  BarValidation,
  STATE_BAR_VALIDATION_RULES,
  US_STATES,
} from "@/lib/constants";
import { Attorney } from "@/lib/types";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";
import ProfileAttorneys from "../../../assets/ProfileAttorneys.png";
import ClipboardIcon from "@/utils/svg/Clipboard";
import { useCurrentPlan, useRequirePlan } from "@/lib/plans/hooks";

function EditProfile({ onFinish }: { onFinish: () => void }) {
  const queryClient = useQueryClient();
  const { data: attorney, refetch } = useCurrentAccount<Attorney>();
  const { mutate: updateAttorney } = useUpdateAttorney(queryClient);

  const initialStateBarValidation = attorney?.barState
    ? STATE_BAR_VALIDATION_RULES[
        Object.entries(US_STATES).find(
          ([_, value]) => attorney?.barState == value
        )[0]
      ]
    : null;
  const [stateBarValidation, setStateBarValidation] = useState<BarValidation>(
    initialStateBarValidation
  );

  const form = useForm({
    defaultValues: {
      firstName: attorney?.firstName,
      middleName: attorney?.middleName,
      lastName: attorney?.lastName,
      suffix: attorney?.suffix,
      barState: attorney?.barState,
      barStateNumber: attorney?.barStateNumber || "",
      phone: attorney?.phone || "",
      professionalEmail: attorney?.professionalEmail || "",
      website: attorney?.website,
    },
    onSubmit: ({
      value: {
        firstName,
        middleName,
        lastName,
        suffix,
        barState,
        barStateNumber,
        phone,
        professionalEmail,
        website,
      },
    }) => {
      updateAttorney({
        firstName,
        middleName,
        lastName,
        suffix,
        barState,
        barStateNumber,
        phone,
        professionalEmail,
        website,
      });
      refetch();

      Toast.show({
        type: "success",
        text1: "Your information has been updated successfully.",
      });
      onFinish();
    },
  });

  return (
    <>
      <ScrollView>
        <View style={{ gap: 16 }}>
          <form.Field
            name="firstName"
            validators={{
              onSubmit: z
                .string()
                .min(1, { message: "First Name is required" }),
            }}
            children={(field) => (
              <FieldWrapper>
                <Label required field={field}>
                  First Name
                </Label>
                <TextInput field={field} />
                <FieldInfo field={field} />
              </FieldWrapper>
            )}
          />
          <form.Field
            name="middleName"
            children={(field) => (
              <FieldWrapper>
                <Label field={field}>Middle Name</Label>
                <TextInput field={field} />
                <FieldInfo field={field} />
              </FieldWrapper>
            )}
          />
          <form.Field
            name="lastName"
            validators={{
              onSubmit: z.string().min(1, { message: "Last Name is required" }),
            }}
            children={(field) => (
              <FieldWrapper>
                <Label required field={field}>
                  Last Name
                </Label>
                <TextInput field={field} />
                <FieldInfo field={field} />
              </FieldWrapper>
            )}
          />
          <form.Field
            name="suffix"
            children={(field) => (
              <FieldWrapper>
                <Label>Suffix</Label>

                <View className="flex flex-row w-full pb-2">
                  <View className="flex flex-row items-center pr-4">
                    <RadioButton
                      selected={field.state.value == ""}
                      onPress={() => field.handleChange("")}
                    />
                    <Text className="pl-2">None</Text>
                  </View>
                  <View className="flex flex-row items-center pr-4">
                    <RadioButton
                      selected={field.state.value == "Second"}
                      onPress={() => field.handleChange("Second")}
                    />
                    <Text className="pl-2">Second</Text>
                  </View>
                  <View className="flex flex-row items-center pr-4">
                    <RadioButton
                      selected={field.state.value == "Third"}
                      onPress={() => field.handleChange("Third")}
                    />
                    <Text className="pl-2">Third</Text>
                  </View>
                  <View className="flex flex-row items-center pr-4">
                    <RadioButton
                      selected={field.state.value == "Fourth"}
                      onPress={() => field.handleChange("Fourth")}
                    />
                    <Text className="pl-2">Fourth</Text>
                  </View>
                </View>
              </FieldWrapper>
            )}
          />

          <View className="border border-gray-400 rounded-lg p-4 my-4 z-10">
            <Text className="text-base text-gray-700 pb-2.5 font-medium pt-2">
              State Bar Number <Text className="text-red-500">*</Text>
            </Text>
            <form.Field
              name="barState"
              validators={{
                onSubmit: ({ value }) => {
                  return !value ? "A bar state is required." : undefined;
                },
              }}
              children={(field) => (
                <DropdownInput
                  initialValue={attorney?.barState}
                  placeholder="Select a state"
                  options={Object.entries(US_STATES).map(([key, value]) => ({
                    key,
                    value,
                  }))}
                  handleValueChange={(value, option) => {
                    field.handleChange(value);

                    // Set validator
                    setStateBarValidation(
                      option ? STATE_BAR_VALIDATION_RULES[option.key] : null
                    );
                  }}
                />
              )}
            />

            <form.Field
              name="barStateNumber"
              validators={{
                onSubmit: z
                  .string()
                  .min(1, { message: "A state bar number is required" })
                  .refine(
                    (value) => {
                      if (!stateBarValidation) return true;
                      return !stateBarValidation.rule.test(value);
                    },
                    { message: stateBarValidation?.message }
                  ),
              }}
              children={(field) => (
                <FieldWrapper>
                  <TextInput field={field} />
                  <FieldInfo field={field} />
                </FieldWrapper>
              )}
            />
          </View>

          <form.Field
            name="phone"
            validators={{
              onSubmit: z.string().min(1, {
                message: "A professional service phone is required",
              }),
            }}
            children={(field) => (
              <FieldWrapper>
                <Label required field={field}>
                  Professional Service Phone
                </Label>
                <TextInput field={field} />
                <FieldInfo field={field} />
              </FieldWrapper>
            )}
          />

          <form.Field
            name="professionalEmail"
            validators={{ onSubmit: z.string().email() }}
            children={(field) => (
              <FieldWrapper>
                <Label required field={field}>
                  Professional Service Email
                </Label>
                <TextInput field={field} />
                <FieldInfo field={field} />
              </FieldWrapper>
            )}
          />

          <form.Field
            name="website"
            validators={{ onSubmit: z.nullable(z.string().url()) }}
            children={(field) => (
              <FieldWrapper>
                <Label field={field}>Website</Label>
                <TextInput field={field} />
                <FieldInfo field={field} />
              </FieldWrapper>
            )}
          />
        </View>
      </ScrollView>

      <View className="fixed -bottom-8 bg-white-500">
        <View
          style={{ gap: 16 }}
          className="flex flex-row justify-between w-full"
        >
          <Button
            buttonStyle="secondary"
            text="Cancel"
            onPress={() => {
              onFinish();
            }}
          />
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                text="Save"
                buttonStyle={
                  !canSubmit || isSubmitting ? "disabled" : "primary"
                }
                onPress={() => {
                  // Trigger form submit
                  form.handleSubmit();
                }}
              />
            )}
          />
        </View>
      </View>
    </>
  );
}

function ProfileCard({ onPressEditInfo }: { onPressEditInfo: () => void }) {
  const { data: attorney } = useCurrentAccount<Attorney>();
  const { data: currentPlan } = useCurrentPlan("attorneys");

  return (
    <View className="w-full border border-gray-400 rounded-lg p-4">
      <Text className="text-gray-700 font-bold text-lg pb-4">
        Personal Information
      </Text>

      <View className="pb-4">
        <Text className="text-gray-700 font-semibold text-base">Full Name</Text>
        <Text className="text-gray-700 font-normal text-base">
          {attorney?.fullName || (
            <Text className="text-gray-500 italic">Pending</Text>
          )}
        </Text>
      </View>

      <View className="pb-4">
        <Text className="text-gray-700 font-semibold text-base">
          Record Speed Handle
        </Text>
        <View className="flex flex-row justify-between items-center">
          <Text className="text-gray-700 font-normal text-base">
            {attorney?.username}
          </Text>

          <Pressable
            className="w-4 h-4 mb-2 mr-2"
            onPress={() => {
              Clipboard.setStringAsync(attorney?.username).then(() => {
                Toast.show({
                  type: "info",
                  text1: "Copied Record Speed Handle to the clipboard!",
                });
              });
            }}
          >
            <ClipboardIcon />
          </Pressable>
        </View>
      </View>

      <View className="pb-4">
        <Text className="text-gray-700 font-semibold text-base">
          State Bar Number
        </Text>
        <Text className="text-gray-700 font-normal text-base">
          {attorney?.barStateNumber || (
            <Text className="text-gray-500 italic">Pending</Text>
          )}
        </Text>
      </View>

      <View className="pb-4">
        <Text className="text-gray-700 font-semibold text-base">
          Professional Service Phone
        </Text>
        <Text className="text-gray-700 font-normal text-base">
          {attorney?.phone || (
            <Text className="text-gray-500 italic">Pending</Text>
          )}
        </Text>
      </View>

      <View className="pb-4">
        <Text className="text-gray-700 font-semibold text-base">
          Professional Service Email
        </Text>
        <Text className="text-gray-700 font-normal text-base">
          {attorney?.professionalEmail || (
            <Text className="text-gray-500 italic">Pending</Text>
          )}
        </Text>
      </View>

      <View className="pb-4">
        <Text className="text-gray-700 font-semibold text-base">Website</Text>
        <Text className="text-gray-700 font-normal text-base">
          {attorney?.website || (
            <Text className="text-gray-500 italic">Pending</Text>
          )}
        </Text>
      </View>

      <View className="h-14 mb-4">
        <Button
          buttonStyle="secondary"
          text="Edit Profile Info"
          onPress={onPressEditInfo}
        />
      </View>
      {currentPlan && (
        <View className="h-14">
          <Button
            buttonStyle="secondary"
            text={`Edit My Plan (${currentPlan.name})`}
            onPress={() => router.push("/home/attorney/plan")}
          />
        </View>
      )}
    </View>
  );
}

function ProfileFooter() {
  const { data: attorney } = useCurrentAccount<Attorney>();
  const areAllMandatoryFieldsPresent =
    attorney?.firstName &&
    attorney?.lastName &&
    attorney?.barStateNumber &&
    attorney?.phone &&
    attorney?.professionalEmail;

  const [canSeeProspectsList, setCanSeeProspectsList] = useState(false);
  return (
    <View className="flex items-center">
      <View className="relative flex items-center pr-9 mb-14">
        <View className="w-48 h-40 mt-8">
          <Image
            style={{
              width: "100%",
              height: "100%",
            }}
            source={ProfileAttorneys}
            contentFit="cover"
          />
        </View>

        <View
          className={`absolute flex justify-center items-center min-w-[80px] h-20 rounded-full -bottom-[52px] px-2 ${
            canSeeProspectsList ? "bg-primary-green" : "bg-red-500"
          }`}
        >
          <Text className="text-white text-3xl font-bold">
            {attorney?.publicPatientsCount || "[#]"}
          </Text>
        </View>
      </View>
      <Text className="text-gray-800 font-bold text-lg pb-4">
        Prospect
        {attorney?.publicPatientsCount && attorney.publicPatientsCount > 1
          ? "s are "
          : " is "}
        waiting!
      </Text>
      <Text className="text-gray-800 font-normal text-lg pb-4 text-center w-64">
        Be the first to assist them with professional advice!
      </Text>
      <View className="pb-4">
        <Text className="text-gray-800 font-normal text-base pb-3">
          Record Speed brings clients in{" "}
          <Text className="font-bold">active search</Text> for leagal
          counselling right at your phone.
        </Text>
      </View>

      <View className="w-full h-14 relative">
        <Button
          text={
            canSeeProspectsList
              ? "See full prospects list"
              : "Unlock opportunities!"
          }
          containerStyle={
            canSeeProspectsList
              ? {
                  backgroundColor: "#4f46e5", // indigo-600
                }
              : {}
          }
          textStyle={
            canSeeProspectsList
              ? {
                  fontWeight: 700,
                  color: "white",
                }
              : {}
          }
          onPress={() => {
            if (canSeeProspectsList) {
              router.push("/home/attorney/prospects");
            } else {
              router.push("/home/attorney/plan");
            }
          }}
        />

        <Text className="absolute text-4xl right-14 -top-1">
          {canSeeProspectsList ? "🔑" : "🔒"}
        </Text>
      </View>
    </View>
  );
}

export default function HomeAttorneyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <>
      <View className=" items-center bg-white w-full h-full pb-20">
        {isEditing ? (
          <>
            <View className="w-full h-full px-8 pt-8 pb-20">
              <EditProfile
                onFinish={() => {
                  setIsEditing(false);
                }}
              />
            </View>
          </>
        ) : (
          <>
            <ScrollView className="w-full">
              <View className="w-full h-full px-8 pt-8 pb-6">
                <ProfileCard
                  onPressEditInfo={() => {
                    setIsEditing(true);
                  }}
                />
                <ProfileFooter />
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </>
  );
}
