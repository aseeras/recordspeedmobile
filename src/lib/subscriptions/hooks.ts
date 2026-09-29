import { useMutation } from "@tanstack/react-query";
import { ApiResource, Subscription, SubscriptionIntent } from "../types";
import { useAccountCredentials } from "../auth/hooks";
import { Details } from "@stripe/stripe-react-native/lib/typescript/src/types/components/CardFieldInput";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export function useSubscriptionIntentMutation(
  userType: "attorneys" | "patients"
) {
  const { data: credentials } = useAccountCredentials();
  return useMutation({
    mutationFn: async function ({ planId }: { planId: number }) {
      const paymentIntent = await createSubscriptionIntent({
        authToken: credentials.authToken,
        userType,
        planId,
      });
      return paymentIntent;
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

async function createSubscriptionIntent({
  authToken,
  userType,
  planId,
}: {
  authToken: string;
  userType: "attorneys" | "patients";
  planId: number;
}): Promise<SubscriptionIntent> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/${userType}/subscription_intents`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify({
        subscription_intent: {
          plan_id: planId,
        },
      }),
    }
  );

  const resBody = (await response.json()) as ApiResource<SubscriptionIntent>;
  return resBody.data.attributes;
}

export function useSubscriptionMutation(userType: "attorneys" | "patients") {
  const { data: credentials } = useAccountCredentials();
  return useMutation({
    mutationFn: async function ({ planId }: { planId: number }) {
      const subscription = await createSubscription({
        userType,
        planId,
        authToken: credentials.authToken,
      });
      return subscription;
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export async function createSubscription({
  userType,
  planId,
  authToken,
}: {
  userType: "attorneys" | "patients";
  planId: number;
  authToken: string;
}): Promise<Subscription> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/${userType}/subscriptions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify({
        subscription: {
          plan_id: planId,
        },
      }),
    }
  );

  const resBody = (await response.json()) as ApiResource<Subscription>;
  return resBody.data.attributes;
}
