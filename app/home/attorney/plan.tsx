import Button from "@/components/Button";
import JoinedList from "@/components/JoinedList";
import {
  PlanContainer,
  PlanDivider,
  PlanFeature,
  PlanFeatureDescription,
  PlanFeatureIcon,
  PlanFeatureTitle,
  PlanPrice,
  PlanTitle,
  Tab,
  Tabs,
} from "@/components/Plan";
import { Toast } from "@/components/Toast";
import { useCurrentPlan, usePlans } from "@/lib/plans/hooks";
import { useSubscriptionIntentMutation } from "@/lib/subscriptions/hooks";
import { Plan as PlanType } from "@/lib/types";
import ChevronLeft from "@/utils/svg/ChevronLeft";

import People from "@/utils/svg/People";
import ProHashtag from "@/utils/svg/ProHashtag";
import ProIllustration from "@/utils/svg/ProIllustration";
import { PaymentSheetError, useStripe } from "@stripe/stripe-react-native";
import { Link } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";

function Container({ children }: { children: React.ReactNode }) {
  return <View className="bg-white rounded-t-2xl h-full">{children}</View>;
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <Text className="text-primary-black text-3xl leading-[38px] font-bold text-center">
      {children}
    </Text>
  );
}

export default function Plan() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const subscriptionIntentMutation = useSubscriptionIntentMutation("attorneys");
  const { data: currentPlan } = useCurrentPlan("attorneys", true);
  const [sheetLoading, setSheetLoading] = useState(false);

  async function initializePaymentSheet(clientSecret: string) {
    const { error } = await initPaymentSheet({
      returnURL: "record-speed-mobile://home/attorney/return",
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

  async function onPlanSelect(plan: PlanType) {
    try {
      setSheetLoading(true);
      const subscriptionIntent = await subscriptionIntentMutation.mutateAsync({
        planId: plan.id,
      });
      await initializePaymentSheet(subscriptionIntent.clientSecret);
      await openPaymentSheet();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: `Error creating the subscription`,
      });
    } finally {
      setSheetLoading(false);
    }
  }

  const [selectedIndex, setSelectedIndex] = useState(
    currentPlan ? (currentPlan?.interval === "month" ? 0 : 1) : 0
  );
  const { data: plans } = usePlans(
    "attorneys",
    selectedIndex == 0 ? "month" : "year"
  );
  const basic = plans?.find((plan) => plan.name === "Basic");
  const pro = plans?.find((plan) => plan.name === "Pro");

  return (
    <>
      <Container>
        <ScrollView>
          <View style={{ gap: 24 }} className="px-8 pb-16 pt-4 mt-4">
            {currentPlan && (
              <>
                <View className="justify-between flex-row items-center">
                  <Text className="text-lg text-dark-4  font-bold">
                    Edit My Plan
                  </Text>
                  <Link href="/home/attorney/profile">
                    <View className="flex-row items-center">
                      <View className="mr-2">
                        <ChevronLeft />
                      </View>
                      <Text className="text-dark-4 font-semibold">Back</Text>
                    </View>
                  </Link>
                </View>
              </>
            )}

            {!currentPlan && (
              <>
                <Title>Select your plan</Title>
                <Tabs
                  selectedIndex={selectedIndex}
                  onChange={(index) => setSelectedIndex(index)}
                >
                  <Tab>Monthly</Tab>
                  <Tab>Yeraly</Tab>
                </Tabs>
              </>
            )}

            {basic && (
              <PlanContainer containerStyle="green">
                <PlanTitle
                  alignment={currentPlan?.id === basic.id ? "left" : "center"}
                  titleStyle="regular"
                >
                  {basic.name}
                </PlanTitle>
                {currentPlan?.id === basic.id && (
                  <View className="absolute right-4 top-5 bg-[#13C29614] px-[14px] py-[5px] rounded-md">
                    <Text className="text-primary-green ">Current Plan</Text>
                  </View>
                )}

                <JoinedList
                  prefix="basic"
                  items={basic.features.map((feature, index) => (
                    <PlanFeature
                      key={feature.data.id}
                      icon={
                        <PlanFeatureIcon icon={feature.data.attributes.icon} />
                      }
                      bottom={
                        index === basic.features.length - 1 && (
                          <>
                            <>
                              <PlanPrice
                                priceStyle="regular"
                                price={basic.price.cents}
                                interval={pro.interval}
                              />
                              <View className="h-12 w-full">
                                {currentPlan?.id === basic.id ? (
                                  <Button
                                    text="Cancel Subscription"
                                    buttonStyle="primary"
                                  />
                                ) : (
                                  <Button
                                    text={
                                      sheetLoading
                                        ? "Loading..."
                                        : "Get Basic Plan"
                                    }
                                    buttonStyle="primary"
                                    disabled={sheetLoading}
                                    onPress={() => onPlanSelect(basic)}
                                  />
                                )}
                              </View>
                            </>
                          </>
                        )
                      }
                    >
                      <PlanFeatureTitle>
                        {feature.data.attributes.title}
                      </PlanFeatureTitle>
                      <PlanFeatureDescription>
                        {feature.data.attributes.description}
                      </PlanFeatureDescription>
                    </PlanFeature>
                  ))}
                  divider={<PlanDivider />}
                />
              </PlanContainer>
            )}

            {pro && (
              <PlanContainer containerStyle="blue">
                <PlanTitle titleStyle="bold">{pro.name}</PlanTitle>

                <View className="items-center">
                  <ProIllustration />
                  <View className="-mt-[26px]">
                    <ProHashtag />
                  </View>
                </View>

                <View style={{ gap: 8 }} className="mb-8">
                  <Text className="text-lg text-dark-3 leading-[26px] font-bold text-center">
                    Prospects are waiting!
                  </Text>
                  <Text className="text-base text-dark-3">
                    Record Speed brings clients in active search for leagal
                    counselling right at your phone.
                  </Text>
                </View>

                {pro.features
                  .filter(
                    (feature) =>
                      feature.data.attributes.title === "Referral List"
                  )
                  .map((feature) => (
                    <PlanFeature
                      key={`referral-${feature.data.id}`}
                      icon={<People color="#3758F9" />}
                    >
                      <PlanFeatureTitle titleStyle="blue">
                        {feature.data.attributes.title}
                      </PlanFeatureTitle>
                      <PlanFeatureDescription descriptionStyle="blue">
                        {feature.data.attributes.description}
                      </PlanFeatureDescription>
                    </PlanFeature>
                  ))}
                <PlanDivider text="+ Everything in Basic" dividerStyle="blue" />

                <JoinedList
                  prefix="pro"
                  items={pro.features
                    .filter(
                      (feature) =>
                        feature.data.attributes.title !== "Referral List"
                    )
                    .map((feature, index) => (
                      <PlanFeature
                        key={feature.data.id}
                        icon={
                          <PlanFeatureIcon
                            color="#3758F9"
                            icon={feature.data.attributes.icon}
                          />
                        }
                        bottom={
                          index === pro.features.length - 2 && (
                            <>
                              <PlanPrice
                                price={pro.price.cents}
                                interval={pro.interval}
                                priceStyle="blue"
                              />
                              <View className="h-12 w-full">
                                {currentPlan?.id === pro.id ? (
                                  <Button
                                    text="Cancel Subscription"
                                    buttonStyle="pro"
                                  />
                                ) : (
                                  <Button
                                    text={
                                      sheetLoading
                                        ? "Loading..."
                                        : "Get Pro Plan"
                                    }
                                    buttonStyle="pro"
                                    disabled={sheetLoading}
                                    onPress={() => onPlanSelect(pro)}
                                  />
                                )}
                              </View>
                            </>
                          )
                        }
                      >
                        <PlanFeatureTitle titleStyle="blue">
                          {feature.data.attributes.title}
                        </PlanFeatureTitle>
                        <PlanFeatureDescription descriptionStyle="blue">
                          {feature.data.attributes.description}
                        </PlanFeatureDescription>
                      </PlanFeature>
                    ))}
                  divider={<PlanDivider dividerStyle="blue" />}
                />
              </PlanContainer>
            )}
          </View>
        </ScrollView>
      </Container>
    </>
  );
}
