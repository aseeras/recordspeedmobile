import AppleSignIn from "@/components/AppleSignIn";
import Button from "@/components/Button";
import { FieldInfo, FieldWrapper, Label, TextInput } from "@/components/Field";
import GoogleSignIn from "@/components/GoogleSignIn";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import ToastPlaceholder, { Toast } from "@/components/Toast";
import { useSignIn, useSignUp } from "@/lib/auth/hooks";
import { SignInParams } from "@/lib/auth/request";
import { AccountType } from "@/lib/types";
import Briefcase from "@/utils/svg/Briefcase";
import Pen from "@/utils/svg/Pen";
import Suit from "@/utils/svg/Suit";
import User from "@/utils/svg/User";
import { useForm } from "@tanstack/react-form";
import cx from "classnames";
import { Stack, useRouter } from "expo-router";
import { ReactNode, useState } from "react";
import {
  GestureResponderEvent,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { z } from "zod";

function SocialLogins({ accountType }: { accountType: AccountType }) {
  const router = useRouter();
  const signInMutation = useSignIn();

  async function handleSignIn(params: SignInParams) {
    const account = await signInMutation.mutateAsync(params);
    router.dismissAll();
    setTimeout(() => {
      router.push("/home");
      Toast.show({
        type: "success",
        text1: `Welcome back ${account.fullName}`,
      });
    }, 0);
  }

  return (
    <View className="flex flex-row justify-around">
      <GoogleSignIn accountType={accountType} handleSubmit={handleSignIn} />
      <AppleSignIn accountType={accountType} handleSubmit={handleSignIn} />
    </View>
  );
}

function LogInInvitation() {
  const router = useRouter();
  return (
    <View style={{ gap: 16 }}>
      <Text className="text-lg text-center font-medium text-gray-700">
        Already have an account?
      </Text>
      <Button
        secondary
        text="Log In"
        onPress={() => {
          router.dismissAll();
          setTimeout(() => {
            router.push("/sign_in");
          }, 0);
        }}
      />
    </View>
  );
}

function SignUpForm({ accountType }: { accountType: AccountType }) {
  const router = useRouter();
  const signUpMutation = useSignUp({ accountType });
  const form = useForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      passwordConfirmation: "",
    },
    async onSubmit(props) {
      try {
        const account = await signUpMutation.mutateAsync({
          email: props.value.email,
          firstName: props.value.firstName,
          lastName: props.value.lastName,
          password: props.value.password,
          personalIdentifier: props.value.email,
          registrationMethod: "internal",
          type: accountType,
        });
        router.dismissAll();
        setTimeout(() => {
          router.push("/home");
          Toast.show({
            type: "success",
            text1: `Welcome ${account.fullName}`,
          });
        }, 0);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: error.message,
        });
      }
    },
  });
  return (
    <>
      <View style={{ gap: 8 }}>
        <form.Field
          name="firstName"
          validators={{
            onSubmit: z.string().min(1, { message: "First Name is required" }),
          }}
          children={(field) => (
            <FieldWrapper>
              <Label>First Name</Label>
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
              <Label field={field} />
              <TextInput field={field} />
              <FieldInfo field={field} />
            </FieldWrapper>
          )}
        />

        <form.Field
          name="email"
          validators={{ onSubmit: z.string().email() }}
          children={(field) => (
            <FieldWrapper>
              <Label field={field} />
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
              <Label field={field} />
              <TextInput field={field} secureTextEntry />
              <FieldInfo field={field} />
            </FieldWrapper>
          )}
        />

        <form.Field
          name="passwordConfirmation"
          validators={{
            onSubmit: z.string().min(6, {
              message: "Password should have at least 6 characters",
            }),
            onChangeListenTo: ["password"],
            onChangeAsync({ value, fieldApi }) {
              if (value !== fieldApi.form.getFieldValue("password")) {
                return "Passwords do not match";
              }
              return undefined;
            },
          }}
          children={(field) => (
            <FieldWrapper>
              <Label field={field} />
              <TextInput field={field} secureTextEntry />
              <FieldInfo field={field} />
            </FieldWrapper>
          )}
        />
      </View>
      <form.Subscribe
        selector={(state) => [state.isSubmitting]}
        children={([isSubmitting]) => (
          <Button
            disabled={isSubmitting}
            text={isSubmitting ? "Signing Up..." : "Sign Up"}
            onPress={() => form.handleSubmit()}
          />
        )}
      />
    </>
  );
}

function PersonalUse({ onGoBack }: { onGoBack: () => void }) {
  return (
    <>
      <UserBadge color={UserBadgeColor.green} onTouchEnd={() => onGoBack()}>
        <SubTitle>Personal Use</SubTitle>
        <Pen />
      </UserBadge>
      <View>
        <Title>Perfect,</Title>
        <Title>Let's sign up!</Title>
      </View>
      <Text className="text-center text-lg">You can use this</Text>
      <SocialLogins accountType="patient" />
      <Text className="text-center text-lg">Or create an account</Text>
      <SignUpForm accountType="patient" />
      <LogInInvitation />
    </>
  );
}

function Attorney({ onGoBack }: { onGoBack: () => void }) {
  return (
    <>
      <UserBadge color={UserBadgeColor.orange} onTouchEnd={() => onGoBack()}>
        <SubTitle>Attorney</SubTitle>
        <Pen />
      </UserBadge>
      <View>
        <Title>Perfect,</Title>
        <Title>Let's sign up!</Title>
      </View>
      <SocialLogins accountType="attorney" />
      <SignUpForm accountType="attorney" />
      <LogInInvitation />
    </>
  );
}

function Insurance({ onGoBack }: { onGoBack: () => void }) {
  return (
    <>
      <UserBadge color={UserBadgeColor.violet} onTouchEnd={() => onGoBack()}>
        <SubTitle>Insurance Company</SubTitle>
        <Pen />
      </UserBadge>
      <View>
        <Title>Perfect,</Title>
        <Title>Let's sign up!</Title>
      </View>
      <SignUpForm accountType="insurance_company" />
      <LogInInvitation />
    </>
  );
}

function UserBadge({
  children,
  color,
  onTouchEnd,
}: {
  children: ReactNode;
  color: UserBadgeColor;
  onTouchEnd?: (event: GestureResponderEvent) => void;
}) {
  return (
    <Pressable onTouchEnd={onTouchEnd}>
      <View
        className={cx("flex flex-row justify-between rounded-lg p-8", {
          "bg-pastel-green": color === UserBadgeColor.green,
          "bg-pastel-orange": color === UserBadgeColor.orange,
          "bg-pastel-violet": color === UserBadgeColor.violet,
        })}
      >
        {children}
      </View>
    </Pressable>
  );
}

function UserSelectionStep({
  onSelection,
}: {
  onSelection: (userType: UserType) => void;
}) {
  return (
    <View style={{ gap: 16 }}>
      <View>
        <Title>How are you</Title>
        <Title>planning to use</Title>
        <Title>RecordSpeed?</Title>
      </View>
      <View style={{ gap: 16 }}>
        <UserBadge
          color={UserBadgeColor.green}
          onTouchEnd={() => onSelection(UserType.personal)}
        >
          <SubTitle>Personal Use</SubTitle>
          <User color="black" />
        </UserBadge>
        <UserBadge
          color={UserBadgeColor.orange}
          onTouchEnd={() => onSelection(UserType.attorney)}
        >
          <SubTitle>Attorney</SubTitle>
          <Suit />
        </UserBadge>
        {/* <UserBadge
          color={UserBadgeColor.violet}
          onTouchEnd={() => onSelection(UserType.insurance)}
        >
          <SubTitle>Insurance Company</SubTitle>
          <Briefcase />
        </UserBadge> */}
      </View>
    </View>
  );
}

function UserRegistrationStep({
  type,
  onGoBack,
}: {
  type: UserType;
  onGoBack: () => void;
}) {
  return (
    <View style={{ gap: 24 }}>
      {type === UserType.personal && <PersonalUse onGoBack={onGoBack} />}
      {type === UserType.attorney && <Attorney onGoBack={onGoBack} />}
      {/* {type === UserType.insurance && <Insurance onGoBack={onGoBack} />} */}
    </View>
  );
}

enum UserType {
  personal,
  attorney,
  insurance,
}

enum UserBadgeColor {
  green,
  violet,
  orange,
}

export default function SignUp() {
  const [userType, setUserType] = useState<undefined | UserType>();
  const [currentStep, setCurrentStep] = useState(0);

  function handleUserTypeSelection(userType: UserType) {
    setUserType(userType);
    setCurrentStep(1);
  }

  function handleGoBack() {
    setUserType(undefined);
    setCurrentStep(0);
  }

  return (
    <View className="flex h-full bg-white px-8 pb-6">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "position" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {currentStep === 0 && (
            <UserSelectionStep onSelection={handleUserTypeSelection} />
          )}
          {currentStep === 1 && (
            <UserRegistrationStep type={userType} onGoBack={handleGoBack} />
          )}
        </ScrollView>
        <ToastPlaceholder />
      </KeyboardAvoidingView>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "white" },
        }}
      />
    </View>
  );
}
