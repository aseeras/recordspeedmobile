import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createMedicalRecordRequest,
  fetchOwnedMedicalRecordRequests,
  fetchSharedWithMeMedicalRecordRequests,
} from "./request";
import Toast from "react-native-toast-message";
import { MedicalRecordRequest } from "../types";
import { useAccountCredentials } from "../auth/hooks";
import { ACCOUNT_KEYS } from "../storageKeychain";

export function useOwnedMedicalRecordRequests() {
  const { data: credentials } = useAccountCredentials();

  return useQuery({
    queryKey: [ACCOUNT_KEYS.medicalRecordRequests.owned],
    enabled: !!credentials?.authToken && credentials?.type == "patient",
    queryFn: async function () {
      return fetchOwnedMedicalRecordRequests({
        credentials,
      });
    },
  });
}

export function useSharedWithMeMedicalRecordRequests() {
  const { data: credentials } = useAccountCredentials();
  return useQuery({
    queryKey: [ACCOUNT_KEYS.medicalRecordRequests.shared],
    enabled: !!credentials?.authToken && credentials?.type == "attorney",
    queryFn: async function () {
      return fetchSharedWithMeMedicalRecordRequests({
        credentials,
      });
    },
  });
}

export function useCreateMedicalRecordRequest() {
  const { data: credentials } = useAccountCredentials();
  return useMutation({
    mutationFn: (medicalRecordRequest: Omit<MedicalRecordRequest, "id">) =>
      createMedicalRecordRequest({
        medicalRecordRequest,
        authToken: credentials?.authToken,
      }),
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: `Something went wrong: ${error}`,
      });
    },
  });
}
