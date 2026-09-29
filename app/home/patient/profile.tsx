import Avatar, { AvatarColors } from "@/components/Avatar";
import Button from "@/components/Button";
import {
  FieldInfo,
  FieldsInfo,
  FieldWrapper,
  Label,
  TextInput,
} from "@/components/Field";
import MedicalInstitutionSearch from "@/components/MedicalInstitutionSearch";
import RadioButton from "@/components/RadioButton";
import { useCurrentAccount } from "@/lib/auth/hooks";
import { useMedicalInstitution } from "@/lib/medicalInstitutions/hooks";
import { useUpdatePatient } from "@/lib/patient/hooks";
import { Patient } from "@/lib/types";
import ClipboardIcon from "@/utils/svg/Clipboard";
import { useForm } from "@tanstack/react-form";
import { format, parse } from "date-fns";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";
import ProfileAttorneys from "../../../assets/ProfileAttorneys.png";

function EditProfile({ onFinish }: { onFinish: () => void }) {
  const { data: patient, refetch } = useCurrentAccount<Patient>();
  const { mutate: updatePatient } = useUpdatePatient();

  const form = useForm({
    defaultValues: {
      firstName: patient.firstName,
      middleName: patient.middleName, // optional
      lastName: patient.lastName,
      suffix: patient.suffix, // optional
      ssnAreaNumber: patient.ssnAreaNumber,
      ssnGroupNumber: patient.ssnGroupNumber,
      ssnSerialNumber: patient.ssnSerialNumber,
      dobDay: patient.dateOfBirth?.split("-")[2],
      dobMonth: patient.dateOfBirth?.split("-")[1],
      dobYear: patient.dateOfBirth?.split("-")[0],
      medicalInstitutionId: patient.medicalInstitutionId,
    },
    onSubmit: ({
      value: {
        firstName,
        middleName,
        lastName,
        suffix,
        ssnAreaNumber,
        ssnGroupNumber,
        ssnSerialNumber,
        dobDay,
        dobMonth,
        dobYear,
        medicalInstitutionId,
      },
    }) => {
      const dateOfBirth = `${dobYear}-${dobMonth}-${dobDay}`;

      updatePatient(
        {
          firstName,
          middleName,
          lastName,
          suffix,
          ssnAreaNumber,
          ssnGroupNumber,
          ssnSerialNumber,
          dateOfBirth,
          medicalInstitutionId,
        },
        {
          onError: function () {
            Toast.show({
              type: "error",
              text1: `Something went wrong updating your information.`,
            });
          },
          onSuccess: async function () {
            Toast.show({
              type: "success",
              text1: "Your information has been updated successfully.",
            });
            await refetch();
            onFinish();
          },
        }
      );
    },
  });

  // Social Security Number inputs refs
  const ssnGroupNumberRef = useRef(null);
  const ssnSerialNumberRef = useRef(null);

  // Date of Birth inputs refs
  const dobDayRef = useRef(null);
  const dobYearRef = useRef(null);

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
                <Label required field={field} />
                <TextInput field={field} />
                <FieldInfo field={field} />
              </FieldWrapper>
            )}
          />
          <form.Field
            name="middleName"
            children={(field) => (
              <FieldWrapper>
                <Label field={field} />
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
                <Label required field={field} />
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

          <form.Field
            name="medicalInstitutionId"
            children={(field) => (
              <MedicalInstitutionSearch
                header={() => {
                  return (
                    <>
                      <Text className="text-base text-gray-700 font-medium pt-4">
                        Medical institution
                      </Text>
                      <Text className="text-base text-gray-700 pb-2.5">
                        Where do you receive medical care?
                      </Text>
                    </>
                  );
                }}
                onSelectMedicalInstitution={(medicalInstitution) => {
                  field.handleChange(medicalInstitution.id);
                }}
              />
            )}
          />

          <FieldWrapper>
            <Label required>Social Security Number</Label>
            <View style={{ gap: 8 }} className="flex-row items-center">
              <View>
                <form.Field
                  validators={{
                    onSubmit: z
                      .string()
                      .length(3, { message: "Area number is invalid" })
                      .refine(
                        (value) => {
                          return !["000", "666", "900", "990"].includes(value);
                        },
                        { message: "Area number is invalid" }
                      ),
                  }}
                  name="ssnAreaNumber"
                  children={(field) => (
                    <TextInput
                      style={{ width: 72 }}
                      field={field}
                      placeholder="000"
                      maxLength={3}
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        field.handleChange(text);

                        if (field.state.value.length == 3) {
                          ssnGroupNumberRef.current.focus();
                        }
                      }}
                    />
                  )}
                />
              </View>

              <Text className="text-gray-400">-</Text>

              <View>
                <form.Field
                  name="ssnGroupNumber"
                  validators={{
                    onSubmit: z
                      .string()
                      .length(2, { message: "Group number is invalid" })
                      .refine(
                        (value) => {
                          return !["00"].includes(value);
                        },
                        { message: "Group number is invalid" }
                      ),
                  }}
                  children={(field) => (
                    <TextInput
                      style={{ width: 62 }}
                      field={field}
                      ref={ssnGroupNumberRef}
                      placeholder="11"
                      maxLength={2}
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        field.handleChange(text);

                        if (field.state.value.length == 2) {
                          ssnSerialNumberRef.current.focus();
                        }
                      }}
                    />
                  )}
                />
              </View>

              <Text className="text-gray-400">-</Text>

              <View>
                <form.Field
                  name="ssnSerialNumber"
                  validators={{
                    onSubmit: z
                      .string()
                      .length(4, { message: "Serial number is invalid" })
                      .refine(
                        (value) => {
                          return !["0000"].includes(value);
                        },
                        { message: "Serial number is invalid" }
                      ),
                  }}
                  children={(field) => (
                    <TextInput
                      style={{ width: 82 }}
                      field={field}
                      ref={ssnSerialNumberRef}
                      placeholder="0000"
                      maxLength={4}
                      keyboardType="numeric"
                    />
                  )}
                />
              </View>
            </View>

            <FieldsInfo
              fields={[
                form.getFieldMeta("ssnAreaNumber"),
                form.getFieldMeta("ssnGroupNumber"),
                form.getFieldMeta("ssnSerialNumber"),
              ]}
            />
          </FieldWrapper>

          <FieldWrapper>
            <Label required>Date of Birth</Label>
            <View style={{ gap: 8 }} className="flex-row items-center">
              <form.Field
                name="dobMonth"
                validators={{
                  onSubmit: z
                    .string()
                    .transform(Number)
                    .refine(
                      (value) => {
                        return value >= 1 && value <= 12;
                      },
                      { message: "Month is invalid" }
                    ),
                }}
                children={(field) => (
                  <TextInput
                    style={{ width: 62 }}
                    field={field}
                    placeholder="MM"
                    maxLength={2}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      field.handleChange(text);

                      if (field.state.value.length == 2) {
                        dobDayRef.current.focus();
                      }
                    }}
                  />
                )}
              />

              <Text className="text-gray-400">/</Text>

              <form.Field
                name="dobDay"
                validators={{
                  onSubmit: z
                    .string()
                    .transform(Number)
                    .refine(
                      (value) => {
                        return value >= 1 && value <= 31;
                      },
                      { message: "Day is invalid" }
                    ),
                }}
                children={(field) => (
                  <TextInput
                    style={{ width: 62 }}
                    field={field}
                    ref={dobDayRef}
                    value={field.state.value}
                    placeholder="DD"
                    maxLength={2}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      field.handleChange(text);

                      if (field.state.value.length == 2) {
                        dobYearRef.current.focus();
                      }
                    }}
                  />
                )}
              />

              <Text className="text-gray-400">/</Text>

              <form.Field
                name="dobYear"
                validators={{
                  onSubmit: z
                    .string()
                    .length(4, { message: "Year is invalid" })
                    .transform(Number),
                }}
                children={(field) => (
                  <TextInput
                    style={{ width: 82 }}
                    field={field}
                    ref={dobYearRef}
                    placeholder="YYYY"
                    maxLength={4}
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
            <FieldsInfo
              fields={[
                form.getFieldMeta("dobDay"),
                form.getFieldMeta("dobMonth"),
                form.getFieldMeta("dobYear"),
              ]}
            />
          </FieldWrapper>
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
              <>
                <Button
                  text="Save"
                  disabled={!canSubmit || isSubmitting}
                  buttonStyle={
                    !canSubmit || isSubmitting ? "disabled" : "primary"
                  }
                  onPress={() => {
                    // Trigger form submit
                    form.handleSubmit();
                  }}
                />
              </>
            )}
          />
        </View>
      </View>
    </>
  );
}

function PublicToAttorneysSection() {
  const { data: patient, refetch } = useCurrentAccount<Patient>();
  const { mutate: updatePatient } = useUpdatePatient();

  const [isEditing, setIsEditing] = useState(false);
  const form = useForm({
    defaultValues: {
      caseDescription: patient.caseDescription,
    },
    onSubmit: ({ value: { caseDescription } }) => {
      updatePatient({
        caseDescription,
      });
      refetch();

      Toast.show({
        type: "success",
        text1: "Your case description has been updated successfully.",
      });
      setIsEditing(false);
    },
  });

  return (
    <View className="w-full border border-gray-400 rounded-lg p-4">
      <View className="w-full flex flex-row items-center pb-6">
        <Avatar color={AvatarColors.yellow} />
        <Text className="text-lg pl-4 font-bold">{patient.username}</Text>
      </View>

      <View className="pb-6">
        <Pressable className="px-3 bg-indigo-100 py-1.5 flex self-start rounded-md">
          <Text className="text-base">Looking for assistance</Text>
        </Pressable>
      </View>

      <View className="pb-2">
        <Text className="text-base">A short description of your case</Text>
      </View>

      {isEditing ? (
        <View className="pb-4">
          <form.Field
            name="caseDescription"
            validators={{
              onChange: ({ value }) => {
                return value == patient.caseDescription;
              },
            }}
            children={(field) => (
              <FieldWrapper>
                <TextInput
                  field={field}
                  value={field.state.value}
                  multiline
                  maxLength={200}
                  placeholder="Add a brief description of your case to help professionals better understand your situation."
                />
                <View className="w-full flex items-end">
                  <Text className="text-gray-500">
                    {field.state.value.length}/200
                  </Text>
                </View>
              </FieldWrapper>
            )}
          />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <View className="flex flex-row justify-between pt-4">
                <View className="flex-1 h-12">
                  <Button
                    buttonStyle="secondary"
                    text="Cancel"
                    onPress={() => {
                      setIsEditing(false);
                    }}
                  />
                </View>
                <View className="w-4" />
                <View className="flex-1 h-12">
                  <Button
                    buttonStyle={!canSubmit ? "disabled" : "primary"}
                    text={isSubmitting ? "Saving..." : "Save"}
                    onPress={() => {
                      // Trigger form submit
                      form.handleSubmit();
                    }}
                  />
                </View>
              </View>
            )}
          />
        </View>
      ) : (
        <>
          <View className="pb-4">
            <Text className="text-base text-gray-500">
              {patient.caseDescription
                ? patient.caseDescription
                : "Add a brief description of your case to help professionals better understand your situation."}
            </Text>
          </View>

          <View className="h-14 mb-6">
            <Button
              buttonStyle="secondary"
              text="Edit Description"
              textStyle={{
                color: "#13C296", // primary-green
              }}
              onPress={() => {
                setIsEditing(true);
              }}
            />
          </View>
        </>
      )}

      <View className="pb-6">
        <Text className="text-base text-blue-600 underline">
          Turning this toggle on you agree to our Terms & Conditions here.
        </Text>
      </View>

      <View className="p-4 bg-gray-100 rounded-lg flex flex-row justify-between">
        <Text className="text-base font-semibold text-gray-700">
          My card is {patient.isPublic ? "" : "not "}public
        </Text>

        <Switch
          value={patient.isPublic}
          onValueChange={async (value) => {
            await updatePatient({
              isPublic: value,
            });
            refetch();
          }}
          trackColor={{
            true: "#13C296", // primary-green
          }}
        />
      </View>
    </View>
  );
}

function ProfileCard({ onPressEditInfo }: { onPressEditInfo: () => void }) {
  const { data: patient } = useCurrentAccount<Patient>();
  const { data: medicalInstitution } = useMedicalInstitution(
    patient.medicalInstitutionId
  );
  const socialSecurityNumber = `${patient.ssnAreaNumber} ${patient.ssnGroupNumber} ${patient.ssnSerialNumber}`;
  const hasFullSocialSecurityNumber =
    patient.ssnAreaNumber && patient.ssnGroupNumber && patient.ssnSerialNumber;

  return (
    <View className="w-full border border-gray-400 rounded-lg p-4">
      <Text className="text-gray-700 font-bold text-lg pb-4">
        Personal Information
      </Text>

      <View className="pb-4">
        <Text className="text-gray-700 font-semibold text-base">Full Name</Text>
        <Text className="text-gray-700 font-normal text-base">
          {patient.fullName || (
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
            {patient.username}
          </Text>

          <Pressable
            className="w-4 h-4 mb-2 mr-2"
            onPress={() => {
              Clipboard.setStringAsync(patient.username).then(() => {
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
          My Medical Institution
        </Text>
        <Text className="text-gray-700 font-normal text-base">
          {medicalInstitution ? (
            medicalInstitution.name
          ) : (
            <Text className="text-gray-500 italic">Pending</Text>
          )}
        </Text>
      </View>

      <View className="pb-4">
        <Text className="text-gray-700 font-semibold text-base">
          Social Security Number
        </Text>
        <Text className="text-gray-700 font-normal text-base">
          {hasFullSocialSecurityNumber ? (
            socialSecurityNumber
          ) : (
            <Text className="text-gray-500 italic">Pending</Text>
          )}
        </Text>
      </View>

      <View className="pb-4">
        <Text className="text-gray-700 font-semibold text-base">DOB</Text>
        <Text className="text-gray-700 font-normal text-base">
          {patient.dateOfBirth ? (
            format(
              parse(patient.dateOfBirth, "yyyy-MM-dd", new Date()),
              "MM / dd / yyyy"
            )
          ) : (
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
      <View className="h-14">
        <Button buttonStyle="secondary" text="Edit My Plan (Free)" />
      </View>
    </View>
  );
}

function ProfileFooter() {
  const { data: patient } = useCurrentAccount<Patient>();

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

        <View className="absolute flex justify-center items-center min-w-[80px] h-20 bg-primary-green rounded-full -bottom-[52px] px-2">
          <Text className="font-medium text-white text-3xl">
            <Text className="font-bold">{patient.attorneysCount || "[#]"}</Text>
          </Text>
        </View>
      </View>
      <Text className="text-gray-800 font-bold text-lg pb-4">
        Attorney
        {patient.attorneysCount && patient.attorneysCount > 1 ? "s" : ""} at
        your disposal
      </Text>
      <Text className="text-gray-800 font-normal text-lg pb-4">
        Record Speed will put you in contact with high-rated, licensed
        profesionals <Text className="font-bold">for free, in no time.</Text>
      </Text>
      <View className="pb-8">
        <Text className="text-gray-800 font-normal text-base pb-3">
          Here you'll be able to request attorneys to get in touch with you.
        </Text>
        <Text className="text-gray-800 font-normal text-base pb-3">
          Just click on the toggle at the bottom of the screen to be added onto
          an public “Looking for Assistance” list within the app.
        </Text>
        <Text className="text-gray-800 font-normal text-base pb-3">
          A little card holding your Record Speed Handle and a button for
          attorneys to reach out at you will be added to the list.
        </Text>
        <Text className="text-gray-800 font-normal text-base pb-3">
          You can also add a short description about your case. This will help
          attorneys better understand how they might assiste you.
        </Text>
        <Text className="text-gray-800 font-normal text-base pb-3">
          Once you engage with an attorney, all fee arrangements are your
          responsibility. Record Speed does not charge for any transactions
          between you and the third party.
        </Text>
        <Text className="text-gray-800 font-normal text-base pb-3">
          At anytime you wish, turning the toggle off will remove your card from
          the list.
        </Text>
        <Text className="text-gray-800 font-normal text-base pb-3">
          By switching the toggle in the card bellow on, you agree to our{" "}
          <Text className="text-blue-600 underline">Terms & Conditions</Text>.
        </Text>
        <Text className="text-gray-800 font-bold text-base pb-3">
          Go ahead, give it a try!
        </Text>
      </View>

      <PublicToAttorneysSection />

      <View className="w-full pt-8">
        <Text className="text-gray-800 font-bold text-base">Need help?</Text>
        <Text className="text-blue-600 font-normal text-base">
          You can contact us at info@rec.speed.com
        </Text>
      </View>
    </View>
  );
}

export default function HomePatientProfile() {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <>
      <View className="flex items-center">
        <Text className="text-white font-semibold text-lg">My Profile</Text>
      </View>
      <View className="relative flex items-center bg-white w-full h-full mt-4 rounded-2xl pb-20">
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
