import Button from "@/components/Button";
import { useCurrentAccount } from "@/lib/auth/hooks";
import { MedicalInstitution } from "@/lib/medicalInstitutions/request";
import { useCreateMedicalRecordRequest } from "@/lib/medicalRecordRequests/hooks";
import { useUpdatePatient } from "@/lib/patient/hooks";
import { Patient } from "@/lib/types";
import Calendar from "@/utils/svg/Calendar";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { format, formatISO, parse, parseISO } from "date-fns";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import DatePicker from "react-native-date-picker";
import Toast from "react-native-toast-message";
import { FieldInfo } from "./Field";
import MedicalInstitutionSearch from "./MedicalInstitutionSearch";

export enum DatePickerType {
  from = "from",
  to = "to",
  dob = "dob",
  none = "none",
}

export default function MedicalRequestSubmissionForm({
  onCancel,
}: {
  onCancel: () => void;
}) {
  const { data: patient } = useCurrentAccount<Patient>();
  const { mutate: updatePatient } = useUpdatePatient();
  const { mutate: createMedicalRecordRequest } =
    useCreateMedicalRecordRequest();

  const [openedDatePicker, setOpenedDatePicker] = useState<DatePickerType>(
    DatePickerType.none
  );

  const [selectedMedicalInstitution, setSelectedMedicalInstitution] =
    useState<MedicalInstitution>();

  const form = useForm({
    defaultValues: {
      ...patient,
      from: "",
      to: "",
      dobDay: patient.dateOfBirth
        ? parseISO(patient.dateOfBirth).getDate().toString()
        : undefined,
      dobMonth: patient.dateOfBirth
        ? parseISO(patient.dateOfBirth).getMonth().toString()
        : undefined,
      dobYear: patient.dateOfBirth
        ? parseISO(patient.dateOfBirth).getFullYear().toString()
        : undefined,
    },
    onSubmit: async ({ value }) => {
      const dateOfBirth = `${value.dobYear}-${value.dobMonth}-${value.dobDay}`;

      await updatePatient({
        firstName: value.firstName,
        middleName: value.middleName,
        lastName: value.lastName,
        suffix: value.suffix,
        dateOfBirth: dateOfBirth,
      });

      await createMedicalRecordRequest({
        from: value.from
          ? formatISO(parse(value.from, "MM / dd / yyyy", new Date()))
          : undefined,
        to: value.to
          ? formatISO(parse(value.to, "MM / dd / yyyy", new Date()))
          : undefined,
        medicalInstitutionId: selectedMedicalInstitution.id,
        patientId: patient.id,
      });

      Toast.show({
        type: "success",
        text1: "Your Medical Record Request was submitted successfully.",
      });

      router.replace("/home");
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
      <View>
        <View className="w-full h-full pb-64">
          <ScrollView className="w-full" keyboardShouldPersistTaps={"never"}>
            <View className="w-full p-6">
              <MedicalInstitutionSearch
                header={() => {
                  return (
                    <>
                      <Text className="text-base text-gray-700 pb-2.5 font-medium">
                        Medical Institution{" "}
                        <Text className="text-red-500">*</Text>
                      </Text>
                    </>
                  );
                }}
                onSelectMedicalInstitution={(medicalInstitution) => {
                  setSelectedMedicalInstitution(medicalInstitution);
                }}
              />

              <form.Field
                name="firstName"
                validators={{
                  onChange: ({ value }) => {
                    return !value ? "A first name is required." : undefined;
                  },
                }}
                children={(field) => (
                  <>
                    <Text className="text-base text-gray-700 pb-2.5 font-medium pt-4">
                      First Name <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                      value={field.state.value}
                      className="border rounded-md text-base border-gray-300 text-gray-400 pl-5 pr-4 py-3"
                      autoCapitalize="none"
                      placeholder="First Name"
                      onChangeText={(text) => {
                        field.handleChange(text);
                      }}
                    />
                    <FieldInfo field={field} />
                  </>
                )}
              />
              <form.Field
                name="middleName"
                children={(field) => (
                  <>
                    <Text className="text-base text-gray-700 pb-2.5 font-medium pt-4">
                      Middle Name
                    </Text>
                    <TextInput
                      value={field.state.value}
                      className="border rounded-md text-base border-gray-300 text-gray-400 pl-5 pr-4 py-3"
                      autoCapitalize="none"
                      placeholder="Middle Name"
                      onChangeText={(text) => {
                        field.handleChange(text);
                      }}
                    />
                    <FieldInfo field={field} />
                  </>
                )}
              />
              <form.Field
                name="lastName"
                validators={{
                  onChange: ({ value }) => {
                    return !value ? "A last name is required." : undefined;
                  },
                }}
                children={(field) => (
                  <>
                    <Text className="text-base text-gray-700 pb-2.5 font-medium pt-4">
                      Last Name <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                      value={field.state.value}
                      className="border rounded-md text-base border-gray-300 text-gray-400 pl-5 pr-4 py-3"
                      autoCapitalize="none"
                      placeholder="Last Name"
                      onChangeText={(text) => {
                        field.handleChange(text);
                      }}
                    />
                    <FieldInfo field={field} />
                  </>
                )}
              />
              <form.Field
                name="suffix"
                children={(field) => (
                  <>
                    <Text className="text-base text-gray-700 pb-2.5 font-medium pt-4">
                      Suffix
                    </Text>
                    <TextInput
                      value={field.state.value}
                      className="border rounded-md text-base border-gray-300 text-gray-400 pl-5 pr-4 py-3"
                      autoCapitalize="none"
                      placeholder="Suffix"
                      onChangeText={(text) => {
                        field.handleChange(text);
                      }}
                    />
                    <FieldInfo field={field} />
                  </>
                )}
              />

              <View className="pt-4 pb-2">
                <Text className="text-base text-gray-700 font-semibold">
                  Period of Request
                </Text>
                <Text className="text-base text-gray-700">
                  Select the historical time frame for which you would like to
                  have access
                </Text>
              </View>

              <form.Field
                name="from"
                validators={{
                  onChange: ({ value }) => {
                    return !value ? "A 'From' Date is required." : undefined;
                  },
                }}
                children={(field) => (
                  <View className="relative">
                    <Text className="text-base text-gray-700 pb-2.5 font-medium">
                      From <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                      value={field.state.value}
                      editable={false}
                      className="border rounded-md text-base border-gray-300 text-gray-400 pl-5 pr-4 py-3"
                      autoCapitalize="none"
                      placeholder="Select Date"
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        field.handleChange(text);
                      }}
                      onTouchEnd={() => {
                        setOpenedDatePicker(DatePickerType.from);
                      }}
                    />
                    <View
                      className="absolute right-4 top-12 pt-1 pl-1 bg-white"
                      onTouchEnd={() => {
                        setOpenedDatePicker(DatePickerType.from);
                      }}
                    >
                      <Calendar />
                    </View>
                    <FieldInfo field={field} />

                    {openedDatePicker == DatePickerType.from && (
                      <DatePicker
                        modal
                        open
                        date={new Date()}
                        maximumDate={new Date()}
                        onConfirm={(date) => {
                          field.handleChange(format(date, "MM / dd / yyyy"));

                          setOpenedDatePicker(DatePickerType.none);
                        }}
                        onCancel={() => {
                          setOpenedDatePicker(DatePickerType.none);
                        }}
                      />
                    )}
                  </View>
                )}
              />

              <form.Field
                name="to"
                validators={{
                  onChangeListenTo: ["from"],
                  onChange: ({ value, fieldApi }) => {
                    const [fromMonth, fromDay, fromYear] = fieldApi.form
                      .getFieldValue("from")
                      .split(" / ");
                    const [toMonth, toDay, toYear] = value.split(" / ");

                    const isToDateBeforeFromDate =
                      toMonth < fromMonth ||
                      (toMonth == fromMonth && toDay < fromDay) ||
                      toYear < fromYear;

                    return !value
                      ? "A 'To' Date is required."
                      : isToDateBeforeFromDate
                      ? "'To' date cannot be before 'From' date"
                      : undefined;
                  },
                }}
                children={(field) => (
                  <View className="relative">
                    <Text className="text-base text-gray-700 pb-2.5 font-medium">
                      To <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                      value={field.state.value}
                      editable={false}
                      className="border rounded-md text-base border-gray-300 text-gray-400 pl-5 pr-4 py-3"
                      autoCapitalize="none"
                      placeholder="Select Date"
                      keyboardType="numeric"
                      onTouchEnd={() => {
                        setOpenedDatePicker(DatePickerType.to);
                      }}
                    />
                    <View
                      className="absolute right-4 top-12 pt-1 pl-1 bg-white"
                      onTouchEnd={() => {
                        setOpenedDatePicker(DatePickerType.to);
                      }}
                    >
                      <Calendar />
                    </View>
                    <FieldInfo field={field} />

                    {openedDatePicker == DatePickerType.to && (
                      <DatePicker
                        modal
                        open
                        date={new Date()}
                        maximumDate={new Date()}
                        onConfirm={(date) => {
                          field.handleChange(format(date, "MM / dd / yyyy"));

                          setOpenedDatePicker(DatePickerType.none);
                        }}
                        onCancel={() => {
                          setOpenedDatePicker(DatePickerType.none);
                        }}
                      />
                    )}
                  </View>
                )}
              />

              <View className="relative mt-4">
                <Text className="text-base text-gray-700 pb-2.5 font-medium">
                  Social Security Number <Text className="text-red-500">*</Text>
                </Text>
                <View className="flex-row items-center gap-4 pb-2">
                  <View>
                    <form.Field
                      name="ssnAreaNumber"
                      validators={{
                        onChange: ({ value }) => {
                          return !value
                            ? "An Area Number is required."
                            : undefined;
                        },
                      }}
                      children={(field) => (
                        <>
                          <TextInput
                            value={field.state.value}
                            className="border rounded-md text-base w-[72px] border-gray-300 text-gray-400 pl-5 pr-4 py-3"
                            autoCapitalize="none"
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
                        </>
                      )}
                    />
                  </View>

                  <Text className="text-gray-400">-</Text>

                  <View>
                    <form.Field
                      name="ssnGroupNumber"
                      validators={{
                        onChange: ({ value }) => {
                          return !value
                            ? "A Group Number is required."
                            : undefined;
                        },
                      }}
                      children={(field) => (
                        <>
                          <TextInput
                            ref={ssnGroupNumberRef}
                            value={field.state.value}
                            className="border rounded-md text-base w-16 border-gray-300 text-gray-400 pl-5 pr-4 py-3"
                            autoCapitalize="none"
                            placeholder="00"
                            maxLength={2}
                            keyboardType="numeric"
                            onChangeText={(text) => {
                              field.handleChange(text);

                              if (field.state.value.length == 2) {
                                ssnSerialNumberRef.current.focus();
                              }
                            }}
                          />
                        </>
                      )}
                    />
                  </View>

                  <Text className="text-gray-400">-</Text>

                  <View>
                    <form.Field
                      name="ssnSerialNumber"
                      validators={{
                        onChange: ({ value }) => {
                          return !value
                            ? "A Serial Number is required."
                            : undefined;
                        },
                      }}
                      children={(field) => (
                        <>
                          <TextInput
                            ref={ssnSerialNumberRef}
                            value={field.state.value}
                            className="border rounded-md text-base w-20 border-gray-300 text-gray-400 pl-5 pr-4 py-3"
                            autoCapitalize="none"
                            placeholder="0000"
                            maxLength={4}
                            keyboardType="numeric"
                            onChangeText={(text) => {
                              field.handleChange(text);
                            }}
                          />
                        </>
                      )}
                    />
                  </View>
                </View>
              </View>

              <View className="relative mt-4">
                <Text className="text-base text-gray-700 pb-2.5 font-medium">
                  Date of Birth <Text className="text-red-500">*</Text>
                </Text>
                <View className="flex-row items-center gap-4 pb-2">
                  <View>
                    <form.Field
                      name="dobMonth"
                      validators={{
                        onChange: ({ value }) => {
                          return !value
                            ? "A Month is required."
                            : isNaN(Number(value))
                            ? "Month must be numeric."
                            : parseInt(value) > 12
                            ? "Month is out of range."
                            : undefined;
                        },
                      }}
                      children={(field) => (
                        <>
                          <TextInput
                            value={field.state.value}
                            className="border rounded-md text-base w-16 border-gray-300 text-gray-400 pl-5 pr-4 py-3"
                            autoCapitalize="none"
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
                        </>
                      )}
                    />
                  </View>

                  <Text className="text-gray-400">/</Text>

                  <View>
                    <form.Field
                      name="dobDay"
                      validators={{
                        onChange: ({ value }) => {
                          return !value
                            ? "A Day is required."
                            : isNaN(Number(value))
                            ? "Day must be numeric."
                            : parseInt(value) > 31
                            ? "Day is out of range."
                            : undefined;
                        },
                      }}
                      children={(field) => (
                        <>
                          <TextInput
                            ref={dobDayRef}
                            value={field.state.value}
                            className="border rounded-md text-base w-16 border-gray-300 text-gray-400 pl-5 pr-4 py-3"
                            autoCapitalize="none"
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
                        </>
                      )}
                    />
                  </View>

                  <Text className="text-gray-400">/</Text>

                  <View>
                    <form.Field
                      name="dobYear"
                      validators={{
                        onChange: ({ value }) => {
                          return !value
                            ? "A Year is required."
                            : isNaN(Number(value))
                            ? "Year must be numeric."
                            : value.length != 4
                            ? "Year must have four digits"
                            : undefined;
                        },
                      }}
                      children={(field) => (
                        <>
                          <TextInput
                            ref={dobYearRef}
                            value={field.state.value}
                            className="border rounded-md text-base w-20 border-gray-300 text-gray-400 pl-5 pr-4 py-3"
                            autoCapitalize="none"
                            placeholder="YYYY"
                            maxLength={4}
                            keyboardType="numeric"
                            onChangeText={(text) => {
                              field.handleChange(text);
                            }}
                          />
                        </>
                      )}
                    />
                  </View>
                </View>
              </View>

              <Text className="text-red-600 text-base font-normal pt-6">
                * Mandatory
              </Text>
            </View>
          </ScrollView>
        </View>
        <View className="pt-6 absolute bg-white bottom-40">
          <View className="flex flex-row justify-between w-full px-8 pb-8">
            <Button
              buttonStyle="secondary"
              text="Cancel"
              onPress={() => {
                onCancel();
              }}
            />
            <View className="w-4" />
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <>
                  <Button
                    text="Send Request"
                    buttonStyle={
                      !canSubmit || isSubmitting || !selectedMedicalInstitution
                        ? "disabled"
                        : "primary"
                    }
                    onPress={() => form.handleSubmit()}
                  />
                </>
              )}
            />
          </View>
        </View>
      </View>
    </>
  );
}
