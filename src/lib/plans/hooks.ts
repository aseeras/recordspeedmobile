import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchCurrentPlan, fetchPlans } from "./request";
import { useAccountCredentials, useCurrentAccount } from "../auth/hooks";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Plan } from "../types";

export function usePlans(
  userType: "attorneys" | "patients",
  interval: "month" | "year" | "all"
) {
  const { data: credentials } = useAccountCredentials();
  return useQuery({
    queryKey: [userType, interval, "plans"],
    queryFn: async function () {
      const data = await fetchPlans({
        userType: userType,
        authToken: credentials.authToken,
      });
      if (interval === "all") {
        return data;
      } else {
        return data.filter((plan) => plan.interval == interval);
      }
    },
  });
}

export function useCurrentPlan(
  userType: "attorneys" | "patients",
  polling: boolean = false
): UseQueryResult<Plan, Error> {
  const { data: credentials } = useAccountCredentials();
  const { data: currentAccount } = useCurrentAccount();
  const { data: plans } = usePlans(
    currentAccount?.type === "Patient" ? "patients" : "attorneys",
    "all"
  );
  const retryCountRef = useRef(0);

  return useQuery({
    enabled: plans !== undefined,
    queryKey: ["current-plan"],
    refetchInterval: (query) => {
      if (!polling) {
        return false;
      }

      if (query.state.error) {
        if (retryCountRef.current >= 50) {
          return false; // Stop refetching after 50 attempts
        }
        retryCountRef.current += 1;
        return 1000; // Refetch every 1 second if there's an error
      }

      // Reset the retry count if the query succeeds
      retryCountRef.current = 0;
      return false;
    },
    queryFn: async function () {
      const data = await fetchCurrentPlan({
        userType: userType,
        authToken: credentials.authToken,
        accountId: currentAccount.id as number,
      });
      return data;
    },
  });
}

export function useRequirePlan(userType: "attorneys" | "patients") {
  const { data: currentAccount } = useCurrentAccount();
  const { data: currentPlan } = useCurrentPlan(userType);
  const router = useRouter();
  useEffect(() => {
    if (currentAccount && !currentPlan) {
      router.replace("/home/attorney/plan");
    }
  }, [currentAccount, currentPlan]);
}
