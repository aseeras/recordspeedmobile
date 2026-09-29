import Button from "@/components/Button";
import { Toast } from "@/components/Toast";
import { useCurrentAccount } from "@/lib/auth/hooks";
import {
  useDocumentPurchase,
  useDocumentPurchaseIntent,
} from "@/lib/documentPurchases/hooks";
import { useMedicalInstitutions } from "@/lib/medicalInstitutions/hooks";
import {
  useOwnedMedicalRecordRequests,
  useSharedWithMeMedicalRecordRequests,
} from "@/lib/medicalRecordRequests/hooks";
import { DocumentPurchaseIntent } from "@/lib/types";
import Check from "@/utils/svg/Check";
import { PaymentSheetError, useStripe } from "@stripe/stripe-react-native";
import { format, parse } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function Document() {
  const router = useRouter();
  const { medicalRecordRequestId, documentId } = useLocalSearchParams();
  const [intent, setIntent] = useState<DocumentPurchaseIntent>();
  const documentPurchaseIntent = useDocumentPurchaseIntent();
  useEffect(() => {
    documentPurchaseIntent.mutate(
      {
        documentId: Number(documentId),
        medicalRecordRequestId: Number(medicalRecordRequestId),
      },
      {
        onSuccess(intent) {
          setIntent(intent);
        },
      }
    );
  }, []);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  async function initializePaymentSheet(clientSecret: string) {
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      allowsDelayedPaymentMethods: true,
      merchantDisplayName: "Record Speed",
    });

    if (error) {
      Toast.show({
        type: "error",
        text1: error.message,
      });
    }
  }

  async function openPaymentSheet() {
    const { error } = await presentPaymentSheet();

    if (error) {
      switch (error.code) {
        case PaymentSheetError.Failed:
          Toast.show({
            type: "error",
            text1: "Payment sheet failed",
          });
          break;
        case PaymentSheetError.Timeout:
          Toast.show({
            type: "error",
            text1: "Payment sheet unknown",
          });
          break;
      }
    } else {
      Toast.show({
        type: "success",
        text1: "Your order is confirmed!",
      });
    }
  }

  const { data: account } = useCurrentAccount();
  const { data: requests } = useSharedWithMeMedicalRecordRequests();
  const medicalRecordRequest = requests?.find(
    (request) => request.id === Number(medicalRecordRequestId)
  );
  const medicalInstitutions = useMedicalInstitutions();
  const { data: documentPurchase, refetch: fetchDocumentPurchase } =
    useDocumentPurchase({
      documentId: Number(documentId),
    });
  useEffect(() => {
    if (documentPurchase) {
      router.push(
        `view_pdf?uri=${process.env.EXPO_PUBLIC_API_BASE_URL}${documentPurchase.document.url}`
      );
    }
  }, [documentPurchase]);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <Container>
      <ScrollView>
        <View style={{ gap: 24 }} className="px-8 pb-8 pt-4 mt-4">
          <Title>Unlock Read Feature for:</Title>
          <View className="bg-pastel-blue-008 rounded-[4px] px-6 py-3">
            {medicalRecordRequest && (
              <Text className="text-brand-blue">
                {account.firstName} Records from{" "}
                {format(
                  parse(medicalRecordRequest.from, "yyyy-MM-dd", new Date()),
                  "MMMM dd, yyyy"
                )}{" "}
                to{" "}
                {format(
                  parse(medicalRecordRequest.to, "yyyy-MM-dd", new Date()),
                  "MMMM dd, yyyy"
                )}
              </Text>
            )}
          </View>
          <Title>Details</Title>
          <View style={{ gap: 8 }}>
            <View style={{ gap: 16 }} className="flex-row">
              <View className="pt-[0.5]">
                <Check />
              </View>
              <View style={{ gap: 8 }}>
                <SubTitle>Certified By</SubTitle>
                <RegularText>
                  {
                    medicalInstitutions?.data.find(
                      (item) =>
                        item.id == medicalRecordRequest.medicalInstitutionId
                    ).name
                  }
                </RegularText>
              </View>
            </View>
          </View>
          <View className="h-1 border-t border-dark-7 w-full my-8"></View>
          <View style={{ gap: 32 }}>
            <Title>Summary</Title>
            <View style={{ gap: 8 }}>
              <View className="flex-row justify-between">
                <RegularText>Cost per page:</RegularText>
                <RegularText>{formatter.format(2)}</RegularText>
              </View>
              <View className="flex-row justify-between">
                <RegularText>Document Pages:</RegularText>
                <RegularText>{intent?.pageCount}</RegularText>
              </View>
              <View className="flex-row justify-between">
                <TotalText>Total</TotalText>
                <TotalText>
                  {intent &&
                    formatter.format(
                      (intent.perPagePriceCents * intent.pageCount) / 100
                    )}
                </TotalText>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{ gap: 16 }}
          className="flex-row bg-white pb-20 h-10 z-50 px-8"
        >
          <Button
            text="Cancel"
            buttonStyle="secondary"
            onPress={() => router.back()}
          />
          <Button
            text="Confirm"
            buttonStyle="primary"
            disabled={!intent}
            onPress={async function () {
              try {
                if (!intent) return;
                await initializePaymentSheet(intent.clientSecret);
                await openPaymentSheet();
                const { data: purchase } = await fetchDocumentPurchase();
                router.replace(
                  `view_pdf?uri=${process.env.EXPO_PUBLIC_API_BASE_URL}${purchase.document.url}`
                );
              } catch (error) {
                console.error(error);
              }
            }}
          />
        </View>
      </ScrollView>
    </Container>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <Text className="text-lg leading-[26px] text-dark-4 font-bold">
      {children}
    </Text>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <Text className="text-base text-dark-4 font-bold">{children}</Text>;
}

function RegularText({ children }: { children: React.ReactNode }) {
  return <Text className="text-base text-dark-4">{children}</Text>;
}

function TotalText({ children }: { children: React.ReactNode }) {
  return (
    <Text className="text-2xl leading-[30px] text-dark-4 font-semibold">
      {children}
    </Text>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return <View className="bg-white rounded-t-2xl h-full">{children}</View>;
}
